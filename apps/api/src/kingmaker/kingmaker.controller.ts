// ─── PFF-TRUST · Kingmaker — Controller ──────────────────────────────────────
import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { KingmakerService }      from "./kingmaker.service";
import { KingmakerVaultService } from "./kingmaker-vault.service";
import { KingmakerSchedulerService } from "./kingmaker-scheduler.service";
import { ApplyPartnerDto }       from "./dto/apply-partner.dto";
import { ApprovePartnerDto, SuspendPartnerDto, CreateVaultDto } from "./dto/approve-partner.dto";

@ApiTags("kingmaker")
@Controller("v1/kingmaker")
export class KingmakerController {
  constructor(
    private readonly km:        KingmakerService,
    private readonly vault:     KingmakerVaultService,
    private readonly scheduler: KingmakerSchedulerService,
  ) {}

  // ── Partner Applications (Bank Portal submits here) ───────────────────────
  @ApiOperation({ summary: "Bank/Fintech applies to join the Sovereign Vault Partner pool. Creates a PENDING application for admin review." })
  @Post("partners/apply")
  apply(@Body() dto: ApplyPartnerDto) {
    return this.km.applyAsPartner(dto);
  }

  @ApiOperation({ summary: "List all sovereign partners — PENDING, APPROVED, SUSPENDED, REVOKED — with live performance counters." })
  @Get("partners")
  listPartners(@Query("orgId") orgId = "default") {
    return this.km.listPartners(orgId);
  }

  // ── Admin: Approve / Suspend ──────────────────────────────────────────────
  @ApiOperation({ summary: "Admin approves a PENDING partner. Issues a Sovereign License Key (shown once). The partner can now receive vault deposits." })
  @Patch("partners/:bankCode/approve")
  approve(@Param("bankCode") bankCode: string, @Body() dto: ApprovePartnerDto) {
    return this.km.approvePartner(bankCode, dto);
  }

  @ApiOperation({ summary: "Admin suspends an APPROVED partner. All new vaults are re-routed. Existing vaults honour their original partner." })
  @Patch("partners/:bankCode/suspend")
  suspend(@Param("bankCode") bankCode: string, @Body() dto: SuspendPartnerDto) {
    return this.km.suspendPartner(bankCode, dto);
  }

  // ── Vault Operations (called internally from savings-cycle) ───────────────
  @ApiOperation({ summary: "Create a SOVEREIGN_RESTRICTED vault at the specified approved partner bank. Called by savings-cycle on new AJO open." })
  @Post("vaults")
  createVault(@Body() dto: CreateVaultDto) {
    return this.vault.createVault(dto);
  }

  @ApiOperation({ summary: "Paginated vault ledger. Filter by status: SOVEREIGN_RESTRICTED | SOVEREIGN_ACTIVE | WITHDRAWN." })
  @Get("vaults")
  getVaults(
    @Query("orgId")  orgId  = "default",
    @Query("limit")  limit  = "50",
    @Query("status") status?: string,
  ) {
    return this.vault.getVaultLedger(orgId, parseInt(limit, 10), status);
  }

  // ── LMR Metrics (Kingmaker Dashboard Overview) ────────────────────────────
  @ApiOperation({ summary: "Kingmaker LMR metrics: TVL, active vaults, flipped today, pending flip, per-partner stats, legacy bank migration breakdown, 30-day chart." })
  @Get("metrics")
  getMetrics(@Query("orgId") orgId = "default") {
    return this.vault.getLmrMetrics(orgId);
  }

  // ── Audit Log ─────────────────────────────────────────────────────────────
  @ApiOperation({ summary: "Kingmaker append-only audit log — every vault creation, flip, withdrawal, and admin action." })
  @Get("audit")
  getAudit(@Query("orgId") orgId = "default", @Query("limit") limit = "100") {
    return this.vault.getAuditLog(orgId, parseInt(limit, 10));
  }

  // ── Admin: Manual Flip Trigger (recovery / testing) ───────────────────────
  @ApiOperation({ summary: "Manually trigger the Day-31 flip cycle. Use for recovery if the cron missed a window." })
  @Patch("scheduler/trigger-flip")
  triggerFlip(@Query("orgId") orgId = "default") {
    return this.scheduler.triggerManualFlip(orgId);
  }

  // ── Full Summary (Dashboard landing) ─────────────────────────────────────
  @ApiOperation({ summary: "Kingmaker quick summary: LMR metrics + partner count + recent audit events." })
  @Get("summary")
  async summary(@Query("orgId") orgId = "default") {
    const [metrics, partners, audit] = await Promise.all([
      this.vault.getLmrMetrics(orgId),
      this.km.listPartners(orgId),
      this.vault.getAuditLog(orgId, 10),
    ]);
    return { metrics, partners: partners.partners.slice(0, 5), recentAudit: audit.logs };
  }
}

