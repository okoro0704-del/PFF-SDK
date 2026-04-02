// ─── PFF-TRUST · Universal Biometric SDK — Types ─────────────────────────────
// F-Man Life OS Middleware · BSSS Protocol

export type SDKFunction = "BAS" | "YES_CALL" | "SSA";
export type SDKStatus   = "SUCCESS" | "FAILED" | "ABORTED" | "PENALTY_BREAK";

export interface SDKResult {
  fn:              SDKFunction;
  status:          SDKStatus;
  successToken?:   string;   // YES_CALL: signed approval token returned to host
  accountNumber?:  string;   // BAS: provisioned account number pushed to host DB
  ajoId?:          string;   // SSA: Ajo session ID
  penaltyApplied?: boolean;  // SSA early-break
  timestamp:       number;
}

// ── FUNCTION 1 — BAS (Biometric Account Setup) ───────────────────────────────
export interface BASConfig {
  tier:      1 | 3;
  hostAppId: string;
  onSuccess: (r: SDKResult) => void;
  onAbort?:  () => void;
}

// ── FUNCTION 2 — YES CALL (Biometric Transaction Gate) ───────────────────────
export interface YesCallConfig {
  hostAppId:   string;
  ref:         string;
  amount:      number;
  beneficiary: string;
  narration?:  string;
  onSuccess:   (r: SDKResult) => void;
  onAbort?:    () => void;
}

// ── FUNCTION 3 — SSA / AJO (Secured Saving Account) ─────────────────────────
export interface SSAConfig {
  hostAppId:      string;
  targetAmount:   number;
  ajoId?:         string;  // re-open existing session
  daysSinceStart?: number; // 0 = Day-1 setup; ≥31 = matured
  onSuccess:      (r: SDKResult) => void;
  onAbort?:       () => void;
}

// ── Union discriminant ────────────────────────────────────────────────────────
export type SDKPayload =
  | { fn: "BAS";      cfg: BASConfig      }
  | { fn: "YES_CALL"; cfg: YesCallConfig  }
  | { fn: "SSA";      cfg: SSAConfig      };

