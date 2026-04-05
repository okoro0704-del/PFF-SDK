// ─── PFF-TRUST · Kingmaker — Constants ───────────────────────────────────────

export const VAULT_STATUS = {
  RESTRICTED: "SOVEREIGN_RESTRICTED",
  ACTIVE:     "SOVEREIGN_ACTIVE",
  WITHDRAWN:  "WITHDRAWN",
} as const;

export const PARTNER_STATUS = {
  PENDING:   "PENDING",
  APPROVED:  "APPROVED",
  SUSPENDED: "SUSPENDED",
  REVOKED:   "REVOKED",
} as const;

export const AUDIT_EVENT = {
  PARTNER_APPLIED:           "PARTNER_APPLIED",
  PARTNER_APPROVED:          "PARTNER_APPROVED",
  PARTNER_SUSPENDED:         "PARTNER_SUSPENDED",
  VAULT_CREATED:             "VAULT_CREATED",
  FLIP_SCHEDULED:            "FLIP_SCHEDULED",
  FLIP_SENT:                 "FLIP_SENT",
  FLIP_SUCCESS:              "FLIP_SUCCESS",
  FLIP_FAILED:               "FLIP_FAILED",
  SDK_WITHDRAWAL_RELEASED:   "SDK_WITHDRAWAL_RELEASED",
} as const;

/** Day-31 flip cron — runs at 00:00 WAT (UTC+1 = 23:00 UTC) */
export const FLIP_CRON = "0 23 * * *";

/** Cycle length in days */
export const CYCLE_DAYS = 31;

/** Annual float interest estimate used for income projections (CBN MPR proxy) */
export const FLOAT_RATE_PA = 0.18;

