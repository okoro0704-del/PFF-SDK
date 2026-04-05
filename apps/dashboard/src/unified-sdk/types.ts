// ─── PFF-TRUST · Unified Sovereign SDK — Complete Type System ────────────────

export type SDKFunctionId =
  | "BAS" | "ZFOE" | "BIH" | "BLS" | "BLIDE" | "ZFPS"
  | "YES_CALL" | "SSA" | "BEPWG" | "LBAS" | "UNWP" | "KYA" | "KINGMAKER";

export type SDKStatus = "SUCCESS" | "FAILED" | "ABORTED" | "PENALTY_BREAK" | "BLOCKED";

export interface SDKResult {
  fn:              SDKFunctionId;
  status:          SDKStatus;
  successToken?:   string;
  accountNumber?:  string;
  ajoId?:          string;
  penaltyApplied?: boolean;
  partnerRef?:     string;
  agentLinked?:    string;
  timestamp:       number;
  [key: string]:   unknown;
}

// ── F01 · BAS ─────────────────────────────────────────────────────────────────
export interface BASConfig {
  tier: 1 | 3; hostAppId: string;
  onSuccess: (r: SDKResult) => void; onAbort?: () => void;
}
// ── F02 · ZFOE ────────────────────────────────────────────────────────────────
export interface ZFOEConfig {
  hostAppId: string; prefillBvn?: string;
  onSuccess: (r: SDKResult) => void; onAbort?: () => void;
}
// ── F03 · BIH ─────────────────────────────────────────────────────────────────
export interface BIHConfig {
  hostAppId: string; sessionRef: string;
  onSuccess: (r: SDKResult) => void; onAbort?: () => void;
}
// ── F04 · BLS ─────────────────────────────────────────────────────────────────
export interface BLSConfig {
  hostAppId: string; accountRef: string; amountMinor: number;
  onSuccess: (r: SDKResult) => void; onAbort?: () => void;
}
// ── F05 · BLIDE ───────────────────────────────────────────────────────────────
export interface BLIDEConfig {
  hostAppId: string; ref: string; amount: number; beneficiary: string;
  onSuccess: (r: SDKResult) => void; onAbort?: () => void;
}
// ── F06 · ZFPS ────────────────────────────────────────────────────────────────
export interface ZFPSConfig {
  hostAppId: string;
  onSuccess: (r: SDKResult) => void; onAbort?: () => void;
}
// ── F07 · YES_CALL ────────────────────────────────────────────────────────────
export interface YesCallConfig {
  hostAppId: string; ref: string; amount: number; beneficiary: string; narration?: string;
  onSuccess: (r: SDKResult) => void; onAbort?: () => void;
}
// ── F08 · SSA ─────────────────────────────────────────────────────────────────
export interface SSAConfig {
  hostAppId: string; targetAmount: number; ajoId?: string; daysSinceStart?: number;
  onSuccess: (r: SDKResult) => void; onAbort?: () => void;
}
// ── F09 · BEPWG ───────────────────────────────────────────────────────────────
export interface BEPWGConfig {
  hostAppId: string; ref: string; amountMinor: number; maxDistanceMeters?: number;
  onSuccess: (r: SDKResult) => void; onAbort?: () => void;
}
// ── F10 · LBAS ────────────────────────────────────────────────────────────────
export interface LBASConfig {
  hostAppId: string; challengeRef: string;
  onSuccess: (r: SDKResult) => void; onAbort?: () => void;
}
// ── F11 · UNWP ────────────────────────────────────────────────────────────────
export interface UNWPConfig {
  hostAppId: string; ref: string; amountMinor: number;
  onSuccess: (r: SDKResult) => void; onAbort?: () => void;
}
// ── F12 · KYA ─────────────────────────────────────────────────────────────────
export interface KYAConfig {
  hostAppId: string; masterAgentId: string;
  onSuccess: (r: SDKResult) => void; onAbort?: () => void;
}
// ── F13 · KINGMAKER ───────────────────────────────────────────────────────────
export interface KINGMAKERConfig {
  hostAppId: string;
  onSuccess: (r: SDKResult) => void; onAbort?: () => void;
}

// ── Union Discriminant (for launch payload) ───────────────────────────────────
export type SDKPayload =
  | { fn: "BAS";       cfg: BASConfig      }
  | { fn: "ZFOE";      cfg: ZFOEConfig     }
  | { fn: "BIH";       cfg: BIHConfig      }
  | { fn: "BLS";       cfg: BLSConfig      }
  | { fn: "BLIDE";     cfg: BLIDEConfig    }
  | { fn: "ZFPS";      cfg: ZFPSConfig     }
  | { fn: "YES_CALL";  cfg: YesCallConfig  }
  | { fn: "SSA";       cfg: SSAConfig      }
  | { fn: "BEPWG";     cfg: BEPWGConfig    }
  | { fn: "LBAS";      cfg: LBASConfig     }
  | { fn: "UNWP";      cfg: UNWPConfig     }
  | { fn: "KYA";       cfg: KYAConfig      }
  | { fn: "KINGMAKER"; cfg: KINGMAKERConfig };

// ── Business Profile ──────────────────────────────────────────────────────────
export interface BusinessProfile {
  status:            "NOT_REGISTERED" | "PENDING" | "VERIFIED" | "SUSPENDED";
  verified:          boolean;
  businessName?:     string;
  biometricCaptured?: boolean;
  verifiedAt?:       string | null;
  profileId?:        string;
}

