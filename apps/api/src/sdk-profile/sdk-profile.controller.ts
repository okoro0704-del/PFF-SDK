import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { SdkProfileService } from "./sdk-profile.service";

@ApiTags("sdk-profile")
@Controller("v1/sdk/profile")
export class SdkProfileController {
  constructor(private readonly svc: SdkProfileService) {}

  @ApiOperation({ summary: "Register a new business profile. Status = PENDING until admin verifies. Required before any SDK function can run." })
  @Post("register")
  register(@Body() dto: {
    hostAppId: string; businessName: string; cacNumber: string;
    cbnLicenceRef?: string; directorName: string; directorBvn: string; orgId?: string;
  }) {
    return this.svc.register(dto);
  }

  @ApiOperation({ summary: "Record biometric capture for a pending profile (step 2 of the BusinessProfileGate flow)." })
  @Patch(":hostAppId/biometric")
  captureBiometric(@Param("hostAppId") hostAppId: string) {
    return this.svc.captureBiometric(hostAppId);
  }

  @ApiOperation({ summary: "Admin: Verify a PENDING profile. Issues a one-time session token and sets status = VERIFIED. All 13 SDK functions unlock." })
  @Patch(":hostAppId/verify")
  verify(@Param("hostAppId") hostAppId: string, @Body() body: { adminNote?: string }) {
    return this.svc.verify(hostAppId, body.adminNote);
  }

  @ApiOperation({ summary: "Admin: Suspend a VERIFIED profile. All SDK functions immediately blocked." })
  @Patch(":hostAppId/suspend")
  suspend(@Param("hostAppId") hostAppId: string, @Body() body: { reason: string }) {
    return this.svc.suspend(hostAppId, body.reason);
  }

  @ApiOperation({ summary: "SDK Gate check — called silently by UnifiedSDKProvider on every launch(). Returns { verified: boolean, status, businessName }." })
  @Get("check")
  check(@Query("hostAppId") hostAppId: string) {
    return this.svc.checkStatus(hostAppId);
  }

  @ApiOperation({ summary: "Admin: List all registered business profiles with status." })
  @Get()
  list(@Query("orgId") orgId = "default") {
    return this.svc.listProfiles(orgId);
  }
}

