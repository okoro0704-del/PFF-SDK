// ─── PFF-TRUST · Kingmaker — Core Service ────────────────────────────────────
import { Injectable, Logger, OnModuleInit, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService }         from "../prisma/prisma.service";
import { PartnerBankClientService } from "./partner-bank-client.service";
import { VAULT_STATUS, PARTNER_STATUS, AUDIT_EVENT, CYCLE_DAYS, FLOAT_RATE_PA } from "./kingmaker.constants";
import type { ApplyPartnerDto }  from "./dto/apply-partner.dto";
import type { ApprovePartnerDto, SuspendPartnerDto, CreateVaultDto } from "./dto/approve-partner.dto";
import * as crypto from "node:crypto";

@Injectable()
export class KingmakerService implements OnModuleInit {
  private readonly logger = new Logger(KingmakerService.name);

  constructor(
    private readonly db:     PrismaService,
    private readonly client: PartnerBankClientService,
  ) {}

  // ── Seed demo sovereign partners + vaults ────────────────────────────────
  async onModuleInit() {
    const existing = await this.db.sovereignPartner.count();
    if (existing > 0) return;

    const approved = [
      { bankCode:"057", bankName:"Zenith Bank",    avgFlipLatencyMs:1200, apiUptimePct:99.8, totalVaultsCreated:1247, totalVaultsFlipped:1105, totalTvlMinor:12_470_000_000n },
      { bankCode:"035", bankName:"Wema Bank",      avgFlipLatencyMs:1800, apiUptimePct:99.1, totalVaultsCreated:430,  totalVaultsFlipped:389,  totalTvlMinor:4_300_000_000n  },
      { bankCode:"101", bankName:"Providus Bank",  avgFlipLatencyMs:2100, apiUptimePct:98.7, totalVaultsCreated:211,  totalVaultsFlipped:198,  totalTvlMinor:2_110_000_000n  },
    ];
    const pending = [
      { bankCode:"035A", bankName:"Sterling Bank" },
      { bankCode:"232",  bankName:"Sterling Bank (New)" },
    ];
    const licKeyHash = crypto.createHash("sha256").update("demo-key").digest("hex");

    for (const p of approved) {
      await this.db.sovereignPartner.create({ data: {
        ...p, apiEndpoint:"https://api.stub-bank.ng", licenseKeyHash:licKeyHash,
        status:PARTNER_STATUS.APPROVED, contactEmail:"api@stub.ng", contactName:"API Team",
        cbnLicenceRef:"CBN/ABL/2024/DEMO", approvedAt:new Date(), totalFlipFailures:5,
        orgId:"default",
      }});
    }
    for (const p of pending) {
      await this.db.sovereignPartner.create({ data: {
        ...p, apiEndpoint:"https://api.stub-pending.ng", licenseKeyHash:licKeyHash,
        status:PARTNER_STATUS.PENDING, contactEmail:"tech@stub.ng", contactName:"Tech Lead",
        cbnLicenceRef:"CBN/ABL/2024/PEND", orgId:"default",
      }}).catch(() => {});
    }

    // Seed sample vaults
    const vaults = [
      { ajoAccountRef:"AJO-SEED-001", partnerBankCode:"057", partnerBankName:"Zenith Bank",     encryptedNuban:"enc:0023456789", partnerVaultRef:"SVLT-001", vaultStatus:VAULT_STATUS.RESTRICTED, targetAmountMinor:100_000_00n, legacyBankCode:"058", legacyBankName:"GTBank",    flipScheduledFor:new Date(Date.now() + 86_400_000 * 5) },
      { ajoAccountRef:"AJO-SEED-002", partnerBankCode:"035", partnerBankName:"Wema Bank",       encryptedNuban:"enc:0034567890", partnerVaultRef:"SVLT-002", vaultStatus:VAULT_STATUS.ACTIVE,     targetAmountMinor:50_000_00n,  legacyBankCode:"057", legacyBankName:"Zenith Bank", flippedAt:new Date() },
      { ajoAccountRef:"AJO-SEED-003", partnerBankCode:"101", partnerBankName:"Providus Bank",   encryptedNuban:"enc:0045678901", partnerVaultRef:"SVLT-003", vaultStatus:VAULT_STATUS.RESTRICTED, targetAmountMinor:200_000_00n, legacyBankCode:"011", legacyBankName:"First Bank",  flipScheduledFor:new Date(Date.now() + 86_400_000 * 12) },
      { ajoAccountRef:"AJO-SEED-004", partnerBankCode:"057", partnerBankName:"Zenith Bank",     encryptedNuban:"enc:0056789012", partnerVaultRef:"SVLT-004", vaultStatus:VAULT_STATUS.WITHDRAWN,  targetAmountMinor:75_000_00n,  legacyBankCode:"044", legacyBankName:"Access Bank", withdrawnAt:new Date() },
    ];
    for (const v of vaults) {
      await this.db.sovereignVault.create({ data:{ ...v, orgId:"default" } }).catch(() => {});
    }
    this.logger.log("Kingmaker seed complete — 3 approved partners, 4 demo vaults");
  }

  // ── Partner Management ────────────────────────────────────────────────────
  async applyAsPartner(dto: ApplyPartnerDto) {
    const exists = await this.db.sovereignPartner.findUnique({ where:{ bankCode:dto.bankCode } });
    if (exists) throw new BadRequestException(`Bank ${dto.bankCode} already has an application`);
    const licenseKeyHash = crypto.createHash("sha256").update(crypto.randomBytes(32)).digest("hex");
    const partner = await this.db.sovereignPartner.create({ data:{ ...dto, licenseKeyHash, status:PARTNER_STATUS.PENDING, orgId:dto.orgId ?? "default" } });
    await this.log({ eventType:AUDIT_EVENT.PARTNER_APPLIED, partnerBankCode:dto.bankCode, orgId:partner.orgId });
    return { message:"Application received. PFF Admin will review within 48 hours.", partnerRef:partner.id };
  }

  async approvePartner(bankCode: string, dto: ApprovePartnerDto) {
    const p = await this.getOrThrow(bankCode);
    const licenseKey = crypto.randomBytes(32).toString("hex");
    const licenseKeyHash = crypto.createHash("sha256").update(licenseKey).digest("hex");
    await this.db.sovereignPartner.update({ where:{ bankCode }, data:{ status:PARTNER_STATUS.APPROVED, approvedAt:new Date(), licenseKeyHash, adminNote:dto.adminNote } });
    await this.log({ eventType:AUDIT_EVENT.PARTNER_APPROVED, partnerBankCode:bankCode, orgId:p.orgId });
    return { message:`${p.bankName} approved as Sovereign Vault Partner`, sovereignLicenseKey:licenseKey, warning:"Store this key securely — it will not be shown again." };
  }

  async suspendPartner(bankCode: string, dto: SuspendPartnerDto) {
    const p = await this.getOrThrow(bankCode);
    await this.db.sovereignPartner.update({ where:{ bankCode }, data:{ status:PARTNER_STATUS.SUSPENDED, suspendedAt:new Date(), adminNote:dto.reason } });
    await this.log({ eventType:AUDIT_EVENT.PARTNER_SUSPENDED, partnerBankCode:bankCode, metadataJson:JSON.stringify({ reason:dto.reason }), orgId:p.orgId });
    return { message:`${p.bankName} suspended from Sovereign Pool` };
  }

  async listPartners(orgId = "default") {
    const partners = await this.db.sovereignPartner.findMany({ where:{ orgId }, orderBy:{ totalTvlMinor:"desc" } });
    return { total:partners.length, approved:partners.filter(p=>p.status===PARTNER_STATUS.APPROVED).length, pending:partners.filter(p=>p.status===PARTNER_STATUS.PENDING).length, partners };
  }

  // ── Internal Helpers ──────────────────────────────────────────────────────
  private async getOrThrow(bankCode: string) {
    const p = await this.db.sovereignPartner.findUnique({ where:{ bankCode } });
    if (!p) throw new NotFoundException(`Sovereign partner ${bankCode} not found`);
    return p;
  }

  async log(e: { eventType:string; vaultRef?:string; ajoAccountRef?:string; partnerBankCode?:string; legacyBankCode?:string; amountMinor?:bigint; latencyMs?:number; metadataJson?:string; orgId?:string }) {
    await this.db.kingmakerAuditLog.create({ data:{ ...e, orgId:e.orgId ?? "default" } }).catch(()=>{});
  }

  getDb()     { return this.db; }
  getClient() { return this.client; }
}

