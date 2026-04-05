// ─── PFF-TRUST · Kingmaker — Partner Bank HTTP Client ────────────────────────
// Calls the three sovereign API endpoints on each approved partner bank.
// Production: real HTTP to partner's endpoint with signed license key header.
// Development/stub: mock successful responses with realistic latency.

import { Injectable, Logger } from "@nestjs/common";

export interface VaultCreateResult {
  nuban:     string;
  vaultRef:  string;
  latencyMs: number;
}

export interface FlipResult {
  success:   boolean;
  latencyMs: number;
}

export interface WithdrawalResult {
  cbsRef:    string;
  latencyMs: number;
}

@Injectable()
export class PartnerBankClientService {
  private readonly logger = new Logger(PartnerBankClientService.name);

  /** POST {endpoint}/vault/create → NUBAN + vaultRef */
  async createVault(p: {
    endpoint:    string;
    licenseKey:  string;
    ajoRef:      string;
    phoneMasked: string;
    amountMinor: bigint;
  }): Promise<VaultCreateResult> {
    const t = Date.now();
    try {
      // Production: uncomment and replace with real HTTP call
      // const res = await fetch(`${p.endpoint}/vault/create`, {
      //   method: "POST",
      //   headers: { "X-PFF-License": p.licenseKey, "Content-Type": "application/json" },
      //   body: JSON.stringify({ ajoRef: p.ajoRef, phone: p.phoneMasked, amountMinor: p.amountMinor.toString() }),
      // });
      // const data = await res.json();
      // return { nuban: data.nuban, vaultRef: data.vaultRef, latencyMs: Date.now() - t };

      // Stub: realistic latency + generated NUBAN
      await delay(120 + rand(280));
      const nuban    = `00${Math.floor(Math.random() * 9_000_000_000 + 1_000_000_000)}`;
      const vaultRef = `SVLT-${Date.now()}-${randHex(6)}`;
      return { nuban, vaultRef, latencyMs: Date.now() - t };
    } catch (err) {
      this.logger.error(`createVault → ${p.endpoint}: ${err}`);
      throw err;
    }
  }

  /** POST {endpoint}/vault/flip-active → flips SOVEREIGN_RESTRICTED → SOVEREIGN_ACTIVE */
  async flipActive(p: {
    endpoint:   string;
    licenseKey: string;
    vaultRef:   string;
    flipToken:  string;   // HMAC-signed PFF approval token
  }): Promise<FlipResult> {
    const t = Date.now();
    try {
      // Production: real HTTP call
      await delay(80 + rand(200));
      const success = Math.random() > 0.02;  // 98% mock success
      if (!success) this.logger.warn(`flipActive FAILED (mock) → ${p.vaultRef}`);
      return { success, latencyMs: Date.now() - t };
    } catch (err) {
      this.logger.error(`flipActive → ${p.endpoint}: ${err}`);
      return { success: false, latencyMs: Date.now() - t };
    }
  }

  /** POST {endpoint}/vault/withdraw → releases funds to user after SDK biometric token */
  async releaseWithdrawal(p: {
    endpoint:       string;
    licenseKey:     string;
    vaultRef:       string;
    amountMinor:    bigint;
    biometricToken: string;
  }): Promise<WithdrawalResult> {
    const t = Date.now();
    await delay(180 + rand(300));
    return { cbsRef: `CBS-${Date.now()}-${randHex(8)}`, latencyMs: Date.now() - t };
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const delay  = (ms: number) => new Promise<void>(r => setTimeout(r, ms));
const rand   = (max: number) => Math.floor(Math.random() * max);
const randHex = (n: number) => Math.random().toString(16).slice(2, 2 + n).toUpperCase();

