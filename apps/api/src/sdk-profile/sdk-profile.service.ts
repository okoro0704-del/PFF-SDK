// ─── PFF-TRUST · SDK Profile — Verified Business Profile Service ─────────────
import {
  Injectable, Logger, OnModuleInit,
  NotFoundException, BadRequestException, ConflictException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import * as crypto from "node:crypto";

export const PROFILE_STATUS = {
  PENDING:   "PENDING",
  VERIFIED:  "VERIFIED",
  SUSPENDED: "SUSPENDED",
} as const;

@Injectable()
export class SdkProfileService implements OnModuleInit {
  private readonly logger = new Logger(SdkProfileService.name);

  constructor(private readonly db: PrismaService) {}

  async onModuleInit() {
    const count = await this.db.verifiedBusinessProfile.count();
    if (count > 0) return;

    // Seed a verified demo profile so the bank portal works immediately
    const token = crypto.randomBytes(32).toString("hex");
    const hash  = crypto.createHash("sha256").update(token).digest("hex");

    await this.db.verifiedBusinessProfile.create({
      data: {
        hostAppId:         "bank-portal",
        businessName:      "F-Man Demo Bank",
        cacNumber:         "RC123456",
        cbnLicenceRef:     "CBN/ABL/2024/DEMO",
        directorName:      "Emmanuel Okoro",
        directorBvn:       "22200000001",
        biometricCaptured: true,
        status:            PROFILE_STATUS.VERIFIED,
        sessionTokenHash:  hash,
        verifiedAt:        new Date(),
        orgId:             "default",
      },
    });
    this.logger.log(`SDK Profile seeded — hostAppId: bank-portal · token: ${token}`);
  }

  // ── Register a new business profile (status = PENDING) ──────────────────────
  async register(dto: {
    hostAppId:     string;
    businessName:  string;
    cacNumber:     string;
    cbnLicenceRef?: string;
    directorName:  string;
    directorBvn:   string;
    orgId?:        string;
  }) {
    const existing = await this.db.verifiedBusinessProfile.findUnique({
      where: { hostAppId: dto.hostAppId },
    });
    if (existing) throw new ConflictException(`hostAppId '${dto.hostAppId}' already registered`);

    const profile = await this.db.verifiedBusinessProfile.create({
      data: { ...dto, status: PROFILE_STATUS.PENDING, orgId: dto.orgId ?? "default" },
    });
    return { message: "Profile registered. Awaiting admin verification.", profileId: profile.id };
  }

  // ── Submit biometric capture (step 2 of gate flow) ──────────────────────────
  async captureBiometric(hostAppId: string) {
    const p = await this.getOrThrow(hostAppId);
    await this.db.verifiedBusinessProfile.update({
      where: { hostAppId },
      data: { biometricCaptured: true },
    });
    return { message: "Biometric captured. Proceeding to CBN licence step.", profileId: p.id };
  }

  // ── Admin: Verify profile ────────────────────────────────────────────────────
  async verify(hostAppId: string, adminNote?: string) {
    await this.getOrThrow(hostAppId);
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hash     = crypto.createHash("sha256").update(rawToken).digest("hex");
    await this.db.verifiedBusinessProfile.update({
      where: { hostAppId },
      data: {
        status: PROFILE_STATUS.VERIFIED,
        sessionTokenHash: hash,
        verifiedAt: new Date(),
        adminNote,
      },
    });
    return { message: "Profile verified. SDK fully unlocked.", sessionToken: rawToken,
             warning: "Store this token securely — not shown again." };
  }

  // ── Admin: Suspend profile ───────────────────────────────────────────────────
  async suspend(hostAppId: string, reason: string) {
    await this.getOrThrow(hostAppId);
    await this.db.verifiedBusinessProfile.update({
      where: { hostAppId },
      data: { status: PROFILE_STATUS.SUSPENDED, suspendedAt: new Date(), adminNote: reason },
    });
    return { message: "Profile suspended. All SDK functions blocked." };
  }

  // ── SDK Gate: Check profile status (called silently on every launch) ─────────
  async checkStatus(hostAppId: string) {
    const p = await this.db.verifiedBusinessProfile.findUnique({ where: { hostAppId } });
    if (!p) return { status: "NOT_REGISTERED", verified: false };
    return {
      status:            p.status,
      verified:          p.status === PROFILE_STATUS.VERIFIED,
      businessName:      p.businessName,
      biometricCaptured: p.biometricCaptured,
      verifiedAt:        p.verifiedAt,
      profileId:         p.id,
    };
  }

  // ── Admin: List all profiles ─────────────────────────────────────────────────
  async listProfiles(orgId = "default") {
    const profiles = await this.db.verifiedBusinessProfile.findMany({
      where: { orgId }, orderBy: { createdAt: "desc" },
    });
    return { total: profiles.length, profiles };
  }

  private async getOrThrow(hostAppId: string) {
    const p = await this.db.verifiedBusinessProfile.findUnique({ where: { hostAppId } });
    if (!p) throw new NotFoundException(`No profile found for hostAppId: ${hostAppId}`);
    return p;
  }
}

