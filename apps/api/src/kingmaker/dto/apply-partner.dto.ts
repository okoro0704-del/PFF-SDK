import { IsEmail, IsString, IsUrl, MinLength } from "class-validator";

/** Submitted by a bank/fintech through the Bank Portal "Join the Table" form */
export class ApplyPartnerDto {
  @IsString()
  bankCode: string;       // 3-digit CBN sort code

  @IsString()
  bankName: string;

  @IsUrl()
  apiEndpoint: string;    // base URL for PFF vault API calls

  @IsEmail()
  contactEmail: string;

  @IsString()
  contactName: string;

  @IsString()
  @MinLength(6)
  cbnLicenceRef: string;  // CBN Agent Banking licence reference

  orgId?: string;
}

