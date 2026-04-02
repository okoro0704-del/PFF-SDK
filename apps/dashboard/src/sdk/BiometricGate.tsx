// ─── PFF-TRUST · SDK FUNCTION 2 — YES CALL (Biometric Transaction Gate) ──────
// Protocol: Replaces host-app PIN screen · 1:1 BSSS biometric match
// Security: Host app NEVER receives raw biometrics — only a signed SUCCESS_TOKEN

import { useState, useEffect } from "react";
import type { YesCallConfig, SDKResult } from "./types";

type GateStep = "review" | "scanning" | "success" | "retry" | "blocked";
const MAX_ATTEMPTS = 2;

/** Generate a signed token (simulates JWT-style BSSS approval token) */
const mintToken = (ref: string) =>
  `BSSS.${ref}.${Date.now()}.${Math.random().toString(36).slice(2,12).toUpperCase()}`;

export function BiometricGate({ cfg }: { cfg: YesCallConfig }) {
  const [step,     setStep]    = useState<GateStep>("review");
  const [attempts, setAttempts] = useState(0);
  const [token]                 = useState(() => mintToken(cfg.ref));

  const startScan = () => {
    setStep("scanning");
    setTimeout(() => {
      // Production: call native biometric driver — returns match confidence score
      // Mock: 90% match success rate
      const matched = Math.random() > 0.10;
      if (matched) {
        setStep("success");
      } else {
        const next = attempts + 1;
        setAttempts(next);
        setStep(next >= MAX_ATTEMPTS ? "blocked" : "retry");
      }
    }, 3000);
  };

  // Auto-close on success — give user 2 s to see confirmation before releasing token
  useEffect(() => {
    if (step === "success") {
      setTimeout(() => cfg.onSuccess({
        fn: "YES_CALL", status: "SUCCESS",
        successToken: token, timestamp: Date.now(),
      } satisfies SDKResult), 2200);
    }
  }, [step]); // eslint-disable-line

  const stepDone   = (s: GateStep) => ["success","retry","blocked"].includes(s);
  const stepActive = (s: GateStep) => s === "scanning";

  return (
    <>
      <div className="sdk-header">
        <div>
          <span className="sdk-badge">F-Man Biometric Gate · YES CALL</span>
          <div className="sdk-title">Transaction Authorization</div>
          <div className="sdk-subtitle">BSSS Protocol · 1:1 Match · Signed Release</div>
        </div>
      </div>

      <div className="sdk-steps">
        <div className={`sdk-step ${step!=="review"?"sdk-step--done":"sdk-step--active"}`}/>
        <div className={`sdk-step ${stepDone(step)?"sdk-step--done":stepActive(step)?"sdk-step--active":""}`}/>
        <div className={`sdk-step ${step==="success"?"sdk-step--done":""}`}/>
      </div>

      {/* ── Review ── */}
      {step === "review" && (<>
        <div className="sdk-info">
          <p><strong>Amount:</strong> ₦{cfg.amount.toLocaleString()}</p>
          <p><strong>To:</strong> {cfg.beneficiary}</p>
          <p><strong>Ref:</strong> {cfg.ref}</p>
          {cfg.narration && <p><strong>Narration:</strong> {cfg.narration}</p>}
        </div>
        <p style={{fontSize:"0.78rem",color:"rgba(255,255,255,0.45)",lineHeight:1.65,marginBottom:"1.2rem"}}>
          Place your enrolled finger on the biometric sensor. Your biometric data never leaves
          this device. The host app will only receive a <strong style={{color:"#c9a84c"}}>signed SUCCESS_TOKEN</strong>.
        </p>
        <button className="sdk-btn sdk-btn--primary" onClick={startScan}>
          👆 Authenticate &amp; Release Funds
        </button>
        {cfg.onAbort && <button className="sdk-btn sdk-btn--ghost" onClick={cfg.onAbort}>Cancel Transaction</button>}
      </>)}

      {/* ── Scanning ── */}
      {step === "scanning" && (
        <div className="sdk-scanner-wrap">
          <div className="sdk-scanner sdk-scanner--scanning">
            <div className="sdk-scanner__ring"/><div className="sdk-scanner__ring"/>👆
          </div>
          <p className="sdk-scan-label"><strong>Scanning…</strong><br/>Keep your finger still on the sensor</p>
        </div>
      )}

      {/* ── Success ── */}
      {step === "success" && (
        <div className="sdk-result">
          <div className="sdk-result__icon">✅</div>
          <div className="sdk-result__title">Biometric Match Confirmed</div>
          <div className="sdk-result__body">Transaction authorized via BSSS Protocol. Releasing funds now.</div>
          <code className="sdk-result__token">SUCCESS_TOKEN: {token}</code>
        </div>
      )}

      {/* ── Retry ── */}
      {step === "retry" && (<>
        <div className="sdk-result">
          <div className="sdk-result__icon">❌</div>
          <div className="sdk-result__title">Biometric Match Failed</div>
          <div className="sdk-result__body">Attempt {attempts}/{MAX_ATTEMPTS}. Please use the same finger registered during enrollment.</div>
        </div>
        <button className="sdk-btn sdk-btn--primary" onClick={startScan}>🔄 Retry Scan</button>
      </>)}

      {/* ── Blocked ── */}
      {step === "blocked" && (
        <div className="sdk-result">
          <div className="sdk-result__icon">🔒</div>
          <div className="sdk-result__title">Transaction Blocked</div>
          <div className="sdk-result__body">Maximum biometric attempts exceeded. This transaction has been flagged and blocked. Contact your bank.</div>
          {cfg.onAbort && <button className="sdk-btn sdk-btn--danger" onClick={cfg.onAbort} style={{marginTop:"1rem"}}>Dismiss</button>}
        </div>
      )}
    </>
  );
}

