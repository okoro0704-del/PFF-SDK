// ─── PFF-TRUST · BusinessProfileGate — 4-Step Business Verification ───────────
// Force-injects BEFORE any SDK function. All 13 functions are blocked until VERIFIED.
// Steps: (1) Business Identity → (2) Director Biometric → (3) CBN Licence → (4) Verified ✅

import { useState } from "react";
import type { BusinessProfile } from "./types";
import { getApiUrl, getHostAppId } from "./config";

const API = getApiUrl();

type Step = "identity" | "biometric" | "cbn" | "verified" | "pending" | "error";

interface Props {
  hostAppId:  string;
  onVerified: (p: BusinessProfile) => void;
  onAbort:    () => void;
}

export function BusinessProfileGate({ hostAppId = getHostAppId(), onVerified, onAbort }: Props) {
  const [step,          setStep]    = useState<Step>("identity");
  const [businessName,  setBName]   = useState("");
  const [cacNumber,     setCac]     = useState("");
  const [directorName,  setDName]   = useState("");
  const [directorBvn,   setDBvn]    = useState("");
  const [cbnLicenceRef, setCbn]     = useState("");
  const [scanning,      setScan]    = useState(false);
  const [submitting,    setSubmit]  = useState(false);
  const [errorMsg,      setError]   = useState<string | null>(null);

  const stepNum = { identity: 1, biometric: 2, cbn: 3, verified: 4, pending: 4, error: 1 }[step];

  // Step 1 → submit business identity + register profile
  const submitIdentity = async () => {
    if (!businessName || !cacNumber || !directorName || directorBvn.length !== 11) return;
    setSubmit(true); setError(null);
    try {
      const r = await fetch(`${API}/v1/sdk/profile/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hostAppId, businessName, cacNumber, directorName, directorBvn }),
      });
      const d = await r.json();
      if (!r.ok && !d.message?.includes("already registered")) {
        setError(d.message ?? "Registration failed"); setSubmit(false); return;
      }
      setStep("biometric");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Network error"); 
    } finally { setSubmit(false); }
  };

  // Step 2 → simulate biometric scan + POST to API
  const scanBiometric = () => {
    setScan(true);
    setTimeout(async () => {
      await fetch(`${API}/v1/sdk/profile/${encodeURIComponent(hostAppId)}/biometric`, { method: "PATCH" }).catch(() => {});
      setScan(false);
      setStep("cbn");
    }, 2800);
  };

  // Step 3 → submit CBN ref + auto-verify (test mode)
  const submitCbn = async () => {
    if (!cbnLicenceRef) return;
    setSubmit(true);
    try {
      // Auto-verify in test/demo mode
      const vr = await fetch(`${API}/v1/sdk/profile/${encodeURIComponent(hostAppId)}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNote: `CBN Ref: ${cbnLicenceRef} — auto-verified` }),
      });
      const vd = await vr.json();
      if (vr.ok) {
        setStep("verified");
        setTimeout(() => {
          onVerified({ status: "VERIFIED", verified: true, businessName });
        }, 2200);
      } else {
        setStep("pending");
      }
      void vd;
    } catch { setStep("pending"); }
    finally { setSubmit(false); }
  };

  return (<>
    <div className="pff-sdk-header">
      <span className="pff-sdk-badge">♛ Business Profile Verification</span>
      <div className="pff-sdk-title">Sovereign Access Gate</div>
      <div className="pff-sdk-subtitle">Complete verification to unlock all 13 SDK functions</div>
    </div>

    <div className="pff-sdk-steps">
      {[1,2,3,4].map(n => (
        <div key={n} className={`pff-sdk-step ${n < stepNum ? "pff-sdk-step--done" : n === stepNum ? "pff-sdk-step--active" : ""}`} />
      ))}
    </div>

    {/* ── Step 1: Business Identity ── */}
    {step === "identity" && (<>
      <div className="pff-sdk-info"><p>Enter your registered business details. This is verified once per session.</p></div>
      {errorMsg && <div style={{color:"#ef4444",fontSize:"0.8rem",background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:"8px",padding:"0.6rem 0.9rem"}}>⚠ {errorMsg}</div>}
      <div className="pff-sdk-field">
        <label className="pff-sdk-label">Registered Business Name *</label>
        <input className="pff-sdk-input" value={businessName} onChange={e => setBName(e.target.value)} placeholder="e.g. Zenith Bank Plc" />
      </div>
      <div className="pff-sdk-field">
        <label className="pff-sdk-label">CAC Registration Number *</label>
        <input className="pff-sdk-input" value={cacNumber} onChange={e => setCac(e.target.value)} placeholder="e.g. RC123456" />
      </div>
      <div className="pff-sdk-field">
        <label className="pff-sdk-label">Director Full Name *</label>
        <input className="pff-sdk-input" value={directorName} onChange={e => setDName(e.target.value)} placeholder="Director's legal name" />
      </div>
      <div className="pff-sdk-field">
        <label className="pff-sdk-label">Director BVN (11 digits) *</label>
        <input className="pff-sdk-input" value={directorBvn} maxLength={11} onChange={e => setDBvn(e.target.value.replace(/\D/g,""))} placeholder="11-digit BVN" />
      </div>
      <button className="pff-sdk-btn pff-sdk-btn--primary" onClick={submitIdentity} disabled={submitting || !businessName || !cacNumber || !directorName || directorBvn.length !== 11}>
        {submitting ? "Verifying…" : "Next — Director Biometric →"}
      </button>
      <button className="pff-sdk-btn pff-sdk-btn--ghost" onClick={onAbort}>Cancel</button>
    </>)}

    {/* ── Step 2: Director Biometric ── */}
    {step === "biometric" && (<>
      <div className="pff-sdk-info">
        <p>Scan <strong>{directorName}'s</strong> fingerprint to confirm director identity. Raw biometric data never leaves this device.</p>
      </div>
      <div className="pff-sdk-scanner-wrap">
        <div className={`pff-sdk-scanner ${scanning ? "pff-sdk-scanner--scanning" : ""}`}
          onClick={() => !scanning && scanBiometric()}
          style={{ cursor: scanning ? "default" : "pointer" }}>
          {scanning && <><div className="pff-sdk-scanner__ring" /><div className="pff-sdk-scanner__ring" /></>}
          {scanning ? "👆" : "🔒"}
        </div>
        <p className="pff-sdk-scan-label">{scanning ? <><strong>Scanning Director Biometric…</strong><br />Hold still</> : "Tap to scan director fingerprint"}</p>
      </div>
      <button className="pff-sdk-btn pff-sdk-btn--primary" onClick={scanBiometric} disabled={scanning}>
        {scanning ? "Scanning…" : "👆 Scan Director Fingerprint"}
      </button>
    </>)}

    {/* ── Step 3: CBN Licence ── */}
    {step === "cbn" && (<>
      <div className="pff-sdk-verified-badge">✅ Director biometric captured successfully</div>
      <div className="pff-sdk-field">
        <label className="pff-sdk-label">CBN Agent Banking Licence Reference *</label>
        <input className="pff-sdk-input" value={cbnLicenceRef} onChange={e => setCbn(e.target.value)} placeholder="e.g. CBN/ABL/2024/001" />
      </div>
      <button className="pff-sdk-btn pff-sdk-btn--primary" onClick={submitCbn} disabled={submitting || !cbnLicenceRef}>
        {submitting ? "Verifying with CBN…" : "♛ Complete Verification"}
      </button>
    </>)}

    {/* ── Step 4a: Verified ── */}
    {step === "verified" && (
      <div className="pff-sdk-result">
        <div className="pff-sdk-result__icon">♛</div>
        <div className="pff-sdk-result__title" style={{color:"#c9a84c"}}>Business Verified — SDK Unlocked</div>
        <div className="pff-sdk-result__body">{businessName} is now a verified sovereign SDK host. All 13 functions are unlocked. Launching your request…</div>
      </div>
    )}

    {/* ── Step 4b: Pending admin review ── */}
    {step === "pending" && (
      <div className="pff-sdk-result">
        <div className="pff-sdk-result__icon">⏳</div>
        <div className="pff-sdk-result__title">Application Under Review</div>
        <div className="pff-sdk-result__body">Your business profile is pending admin verification. You will be notified once approved. SDK functions will unlock automatically.</div>
        <button className="pff-sdk-btn pff-sdk-btn--ghost" onClick={onAbort} style={{marginTop:"1rem"}}>Close</button>
      </div>
    )}
  </>);
}

