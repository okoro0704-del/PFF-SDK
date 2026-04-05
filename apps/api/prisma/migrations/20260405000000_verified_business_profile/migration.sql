-- Migration: 20260405000000_verified_business_profile
-- PFF-TRUST · Unified SDK Gate — Verified Business Profile

CREATE TABLE "verified_business_profile" (
  "id"                  TEXT         NOT NULL,
  "host_app_id"         TEXT         NOT NULL,
  "business_name"       TEXT         NOT NULL,
  "cac_number"          TEXT         NOT NULL,
  "cbn_licence_ref"     TEXT,
  "director_name"       TEXT         NOT NULL,
  "director_bvn"        TEXT         NOT NULL,
  "biometric_captured"  BOOLEAN      NOT NULL DEFAULT false,
  "status"              TEXT         NOT NULL DEFAULT 'PENDING',
  "session_token_hash"  TEXT,
  "admin_note"          TEXT,
  "verified_at"         TIMESTAMP(3),
  "suspended_at"        TIMESTAMP(3),
  "org_id"              TEXT         NOT NULL DEFAULT 'default',
  "created_at"          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at"          TIMESTAMP(3) NOT NULL,

  CONSTRAINT "verified_business_profile_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "verified_business_profile_host_app_id_key" ON "verified_business_profile"("host_app_id");
CREATE INDEX "verified_business_profile_status_idx"             ON "verified_business_profile"("status");
CREATE INDEX "verified_business_profile_org_status_idx"         ON "verified_business_profile"("org_id", "status");
CREATE INDEX "verified_business_profile_cac_idx"                ON "verified_business_profile"("cac_number");

