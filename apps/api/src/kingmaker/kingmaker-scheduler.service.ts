// ─── PFF-TRUST · Kingmaker — Day-31 Flip Scheduler ───────────────────────────
// Runs daily at 23:00 UTC (00:00 WAT).
// Finds all SOVEREIGN_RESTRICTED vaults whose flip window has arrived,
// calls the partner bank API to flip status, then updates PFF DB + audit log.

import { Injectable, Logger } from "@nestjs/common";
import { Cron }               from "@nestjs/schedule";
import { KingmakerService }   from "./kingmaker.service";
import { VAULT_STATUS, AUDIT_EVENT, FLIP_CRON, PARTNER_STATUS } from "./kingmaker.constants";

@Injectable()
export class KingmakerSchedulerService {
  private readonly logger = new Logger(KingmakerSchedulerService.name);

  constructor(private readonly km: KingmakerService) {}

  @Cron(FLIP_CRON)
  async runDayThirtyOneFlip() {
    const db     = this.km.getDb();
    const client = this.km.getClient();
    const orgId  = "default";

    this.logger.log("Kingmaker Day-31 flip cycle started");

    // Find all vaults due for flip
    const due = await db.sovereignVault.findMany({
      where: {
        orgId,
        vaultStatus:      VAULT_STATUS.RESTRICTED,
        flipScheduledFor: { lte: new Date() },
      },
    });

    this.logger.log(`Found ${due.length} vault(s) due for flip`);
    let success = 0;
    let failed  = 0;

    for (const vault of due) {
      // Fetch the partner for their API endpoint
      const partner = await db.sovereignPartner.findUnique({
        where: { bankCode: vault.partnerBankCode },
      });

      if (!partner || partner.status !== PARTNER_STATUS.APPROVED) {
        this.logger.warn(`Partner ${vault.partnerBankCode} not approved — skipping vault ${vault.id}`);
        continue;
      }

      await this.km.log({ eventType:AUDIT_EVENT.FLIP_SENT, vaultRef:vault.id, ajoAccountRef:vault.ajoAccountRef, partnerBankCode:vault.partnerBankCode, amountMinor:vault.targetAmountMinor, orgId });

      const flipToken = `FLIP-${vault.id}-${Date.now()}`;
      const result = await client.flipActive({
        endpoint:   partner.apiEndpoint,
        licenseKey: partner.licenseKeyHash,
        vaultRef:   vault.partnerVaultRef,
        flipToken,
      });

      if (result.success) {
        // Mark vault as SOVEREIGN_ACTIVE
        await db.sovereignVault.update({
          where: { id: vault.id },
          data:  { vaultStatus: VAULT_STATUS.ACTIVE, flippedAt: new Date(), flipLatencyMs: result.latencyMs },
        });

        // Update partner running counters
        await db.sovereignPartner.update({
          where: { bankCode: vault.partnerBankCode },
          data: {
            totalVaultsFlipped: { increment: 1 },
            // EMA flip latency: (prev * 0.9) + (new * 0.1)
            avgFlipLatencyMs: Math.round(partner.avgFlipLatencyMs * 0.9 + result.latencyMs * 0.1),
          },
        });

        await this.km.log({ eventType:AUDIT_EVENT.FLIP_SUCCESS, vaultRef:vault.id, partnerBankCode:vault.partnerBankCode, amountMinor:vault.targetAmountMinor, latencyMs:result.latencyMs, orgId });
        this.logger.log(`✅ Flipped vault ${vault.id} → SOVEREIGN_ACTIVE (${result.latencyMs}ms)`);
        success++;
      } else {
        // Record failure — will retry next cron run
        await db.sovereignPartner.update({
          where: { bankCode: vault.partnerBankCode },
          data: { totalFlipFailures: { increment: 1 } },
        });
        await this.km.log({ eventType:AUDIT_EVENT.FLIP_FAILED, vaultRef:vault.id, partnerBankCode:vault.partnerBankCode, latencyMs:result.latencyMs, metadataJson:JSON.stringify({ flipToken }), orgId });
        this.logger.error(`❌ Flip FAILED for vault ${vault.id} at ${partner.bankName}`);
        failed++;
      }
    }

    this.logger.log(`Day-31 flip cycle complete — success:${success}  failed:${failed}`);
  }

  /** Manual trigger endpoint for admin (test/recovery) */
  async triggerManualFlip(orgId = "default") {
    return this.runDayThirtyOneFlip();
  }
}

