// ─── PFF-TRUST · Kingmaker — Vault & Metrics Service ─────────────────────────
import { Injectable, BadRequestException } from "@nestjs/common";
import { KingmakerService }   from "./kingmaker.service";
import { VAULT_STATUS, PARTNER_STATUS, AUDIT_EVENT, CYCLE_DAYS, FLOAT_RATE_PA } from "./kingmaker.constants";
import type { CreateVaultDto } from "./dto/approve-partner.dto";
import * as crypto from "node:crypto";

/** AES-256-GCM encryption for NUBAN — key from env in production */
const ENC_KEY = Buffer.from(process.env.NUBAN_ENC_KEY ?? "0".repeat(64), "hex").slice(0, 32);
function encryptNuban(nuban: string): string {
  const iv  = crypto.randomBytes(12);
  const cip = crypto.createCipheriv("aes-256-gcm", ENC_KEY, iv);
  const enc = Buffer.concat([cip.update(nuban, "utf8"), cip.final()]);
  const tag = cip.getAuthTag();
  return `${iv.toString("hex")}:${enc.toString("hex")}:${tag.toString("hex")}`;
}
function decryptNuban(blob: string): string {
  const [ivHex, encHex, tagHex] = blob.split(":");
  if (!ivHex || blob.startsWith("enc:")) return "••••••••••"; // demo placeholder
  const dec = crypto.createDecipheriv("aes-256-gcm", ENC_KEY, Buffer.from(ivHex, "hex"));
  dec.setAuthTag(Buffer.from(tagHex, "hex"));
  return dec.update(Buffer.from(encHex, "hex")).toString("utf8") + dec.final("utf8");
}

@Injectable()
export class KingmakerVaultService {
  constructor(private readonly km: KingmakerService) {}

  // ── Create Sovereign Vault (called from savings-cycle on AJO open) ────────
  async createVault(dto: CreateVaultDto) {
    const db     = this.km.getDb();
    const client = this.km.getClient();
    const orgId  = dto.orgId ?? "default";

    const partner = await db.sovereignPartner.findUnique({ where:{ bankCode:dto.partnerBankCode } });
    if (!partner || partner.status !== PARTNER_STATUS.APPROVED)
      throw new BadRequestException(`Bank ${dto.partnerBankCode} is not an approved Sovereign Partner`);

    // Call partner bank API → create SOVEREIGN_RESTRICTED NUBAN
    const result = await client.createVault({
      endpoint:    partner.apiEndpoint,
      licenseKey:  partner.licenseKeyHash,   // production: use the real key from secure store
      ajoRef:      dto.ajoAccountRef,
      phoneMasked: dto.phoneMasked ?? "****",
      amountMinor: dto.targetAmountMinor,
    });

    const flipScheduledFor = new Date();
    flipScheduledFor.setDate(flipScheduledFor.getDate() + CYCLE_DAYS);
    flipScheduledFor.setHours(23, 0, 0, 0); // 00:00 WAT = 23:00 UTC prev day

    const vault = await db.sovereignVault.create({ data:{
      ajoAccountRef:    dto.ajoAccountRef,
      partnerBankCode:  dto.partnerBankCode,
      partnerBankName:  partner.bankName,
      encryptedNuban:   encryptNuban(result.nuban),
      partnerVaultRef:  result.vaultRef,
      vaultStatus:      VAULT_STATUS.RESTRICTED,
      legacyBankCode:   dto.legacyBankCode,
      legacyBankName:   dto.legacyBankName,
      targetAmountMinor:dto.targetAmountMinor,
      flipScheduledFor,
      orgId,
    }});

    // Update partner running counters
    await db.sovereignPartner.update({ where:{ bankCode:dto.partnerBankCode }, data:{
      totalVaultsCreated: { increment:1 },
      totalTvlMinor: { increment:dto.targetAmountMinor },
    }});

    await this.km.log({ eventType:AUDIT_EVENT.VAULT_CREATED, vaultRef:vault.id, ajoAccountRef:dto.ajoAccountRef, partnerBankCode:dto.partnerBankCode, legacyBankCode:dto.legacyBankCode, amountMinor:dto.targetAmountMinor, latencyMs:result.latencyMs, orgId });
    return { vaultId:vault.id, nuban:result.nuban, vaultRef:result.vaultRef, status:VAULT_STATUS.RESTRICTED, flipScheduledFor, partnerBank:partner.bankName };
  }

  // ── LMR Metrics (Kingmaker Dashboard Overview tab) ───────────────────────
  async getLmrMetrics(orgId = "default") {
    const db = this.km.getDb();
    const [tvlAgg, activeCount, flippedToday, pendingFlip, perPartner, legacyBreakdown, dailyChart] = await Promise.all([
      db.sovereignVault.aggregate({ where:{ orgId, vaultStatus:{ in:[VAULT_STATUS.RESTRICTED, VAULT_STATUS.ACTIVE] } }, _sum:{ targetAmountMinor:true } }),
      db.sovereignVault.count({ where:{ orgId, vaultStatus:VAULT_STATUS.RESTRICTED } }),
      db.sovereignVault.count({ where:{ orgId, vaultStatus:VAULT_STATUS.ACTIVE, flippedAt:{ gte:new Date(new Date().setHours(0,0,0,0)) } } }),
      db.sovereignVault.count({ where:{ orgId, vaultStatus:VAULT_STATUS.RESTRICTED, flipScheduledFor:{ lte:new Date(Date.now() + 86_400_000) } } }),
      db.sovereignPartner.findMany({ where:{ orgId, status:PARTNER_STATUS.APPROVED }, select:{ bankCode:true, bankName:true, totalVaultsCreated:true, totalTvlMinor:true, avgFlipLatencyMs:true, apiUptimePct:true, totalFlipFailures:true } }),
      db.sovereignVault.groupBy({ by:["legacyBankCode","legacyBankName"], where:{ orgId }, _count:{ id:true }, _sum:{ targetAmountMinor:true }, orderBy:{ _sum:{ targetAmountMinor:"desc" } }, take:10 }),
      // Last 30 days vault creation (approximated with mock for chart data)
      db.sovereignVault.findMany({ where:{ orgId, createdAt:{ gte:new Date(Date.now() - 30*86_400_000) } }, select:{ createdAt:true, targetAmountMinor:true }, orderBy:{ createdAt:"asc" } }),
    ]);

    const tvlMinor    = tvlAgg._sum.targetAmountMinor ?? 0n;
    const tvlNaira    = Number(tvlMinor) / 100;
    const floatIncEst = tvlNaira * FLOAT_RATE_PA / 365 * 15; // est 15-day avg lock remaining

    return {
      tvlMinor:      tvlMinor.toString(),
      tvlFormatted:  `₦${tvlNaira.toLocaleString("en-NG", { maximumFractionDigits:0 })}`,
      floatIncomeEstimate:`₦${floatIncEst.toLocaleString("en-NG", { maximumFractionDigits:0 })}`,
      activeVaultCount:  activeCount,
      flippedToday,
      pendingFlipCount:  pendingFlip,
      partnerBreakdown:  perPartner.map(p=>({ ...p, totalTvlMinor:p.totalTvlMinor.toString() })),
      legacyBankBreakdown: legacyBreakdown.map(r=>({ bankCode:r.legacyBankCode, bankName:r.legacyBankName, vaultCount:r._count.id, tvlMinor:(r._sum.targetAmountMinor??0n).toString() })),
      dailyVaultCreation: dailyChart.map(v=>({ date:v.createdAt.toISOString().slice(0,10), amountMinor:v.targetAmountMinor.toString() })),
    };
  }

  // ── Vault Ledger (paginated) ──────────────────────────────────────────────
  async getVaultLedger(orgId = "default", limit = 50, status?: string) {
    const db     = this.km.getDb();
    const where  = { orgId, ...(status ? { vaultStatus:status } : {}) };
    const [total, vaults] = await Promise.all([
      db.sovereignVault.count({ where }),
      db.sovereignVault.findMany({ where, orderBy:{ createdAt:"desc" }, take:limit, select:{ id:true, ajoAccountRef:true, partnerBankName:true, partnerBankCode:true, vaultStatus:true, targetAmountMinor:true, legacyBankName:true, createdAt:true, flipScheduledFor:true, flippedAt:true, withdrawnAt:true, flipLatencyMs:true } }),
    ]);
    return { total, vaults:vaults.map(v=>({ ...v, targetAmountMinor:v.targetAmountMinor.toString() })) };
  }

  // ── Audit Log ─────────────────────────────────────────────────────────────
  async getAuditLog(orgId = "default", limit = 100) {
    const logs = await this.km.getDb().kingmakerAuditLog.findMany({ where:{ orgId }, orderBy:{ createdAt:"desc" }, take:limit });
    return { total:logs.length, logs:logs.map(l=>({ ...l, amountMinor:l.amountMinor?.toString() })) };
  }
}

