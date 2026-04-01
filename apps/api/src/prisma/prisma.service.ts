import { Injectable, OnModuleDestroy, Logger } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super();
    // Prisma connects lazily on the first query — no blocking $connect() at startup.
    // This is required when the direct PostgreSQL port is unavailable at boot time
    // (e.g. Supabase Transaction Pooler used via HTTPS proxy, or ISP port filtering).
    this.logger.log("PrismaService initialised (lazy connection mode)");
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  /** RLS: set org for current DB session (call before scoped queries). */
  async setOrgContext(orgId: string) {
    await this.$executeRaw`SELECT set_config('app.current_org_id', ${orgId}, false)`;
  }
}
