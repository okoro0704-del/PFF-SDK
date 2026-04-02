// ─── PFF-TRUST · KYA Module — Know Your Agent · Types ────────────────────────
// F-Man Life OS Middleware · Chain of Trust · Sub-Sovereign Agent Hierarchy

export type AgentTier = "MASTER" | "PRIMARY" | "SUB";
export type SubStatus = "PENDING_BIO" | "ACTIVE" | "SUSPENDED" | "BLACKLISTED";

// ── Individual Sub-Agent record ───────────────────────────────────────────────
export interface SubAgent {
  ssId:         string;   // Sub-Sovereign ID: SS-{masterID}-{seq}  e.g. SS-MA001-0001
  bvnMasked:    string;   // e.g. "2237***5891"
  phoneMasked:  string;   // e.g. "0803***6789"
  displayName:  string;   // populated from BVN registry via NIBSS
  linkedAt:     number;   // Unix ms
  status:       SubStatus;
  bioActivated: boolean;  // BAS biometric template activated for this terminal
  terminalId?:  string;   // POS device ID or mobile instance
}

// ── Master / Primary Agent profile ───────────────────────────────────────────
export interface MasterProfile {
  agentId:     string;
  displayName: string;
  bvnMasked:   string;
  tier:        AgentTier;
  subAgents:   SubAgent[];
}

// ── Enrollment wizard step discriminant ───────────────────────────────────────
export type EnrollStep = "input" | "blacklist" | "otp" | "bond" | "done";

// ── Enrollment draft state ────────────────────────────────────────────────────
export interface EnrollDraft {
  bvn:   string;   // raw input (never persisted / logged)
  phone: string;   // raw input
  ssId:  string;   // assigned at bond step
}

// ── F-Man Global Blacklist check result ───────────────────────────────────────
export type BlacklistResult = "CLEAR" | "FLAGGED";

