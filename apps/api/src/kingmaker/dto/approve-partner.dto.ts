import { IsOptional, IsString } from "class-validator";

export class ApprovePartnerDto {
  @IsOptional() @IsString() adminNote?: string;
  orgId?: string;
}

export class SuspendPartnerDto {
  @IsString() reason: string;
  orgId?: string;
}

export class CreateVaultDto {
  ajoAccountRef:   string;
  partnerBankCode: string;
  targetAmountMinor: bigint;
  legacyBankCode?: string;
  legacyBankName?: string;
  /** Masked phone number — used by partner bank to link NUBAN to the user */
  phoneMasked?:    string;
  orgId?:          string;
}

