// ─── PFF-TRUST · Kingmaker — Module ──────────────────────────────────────────
//
// Dependency graph (acyclic):
//   PartnerBankClientService  → (no DB, pure HTTP)
//   KingmakerService          → PrismaService + PartnerBankClientService
//   KingmakerVaultService     → KingmakerService
//   KingmakerSchedulerService → KingmakerService
//   KingmakerController       → KingmakerService + KingmakerVaultService + KingmakerSchedulerService
//
// Register KingmakerModule AFTER RsccModule in app.module.ts (seeds depend on
// AjoAccount rows created by RsccAjoService on first boot).

import { Module }                      from "@nestjs/common";
import { PartnerBankClientService }    from "./partner-bank-client.service";
import { KingmakerService }            from "./kingmaker.service";
import { KingmakerVaultService }       from "./kingmaker-vault.service";
import { KingmakerSchedulerService }   from "./kingmaker-scheduler.service";
import { KingmakerController }         from "./kingmaker.controller";

@Module({
  controllers: [KingmakerController],
  providers: [
    PartnerBankClientService,
    KingmakerService,
    KingmakerVaultService,
    KingmakerSchedulerService,
  ],
  exports: [KingmakerService, KingmakerVaultService],
})
export class KingmakerModule {}

