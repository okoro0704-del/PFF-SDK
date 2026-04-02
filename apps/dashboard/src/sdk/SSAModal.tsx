// ─── PFF-TRUST · SDK FUNCTION 3 — SSA/AJO (Secured Saving Account) ───────────
// Protocol: 31-Day Ajo Savings Cycle · Biometric Ajo-Signature lock
// 10m-Rule Gate: mandatory cooling-off before early-break · 50% penalty enforcement

import { useState, useEffect, useRef } from "react";
import type { SSAConfig, SDKResult } from "./types";

type SSAStep = "disclose" | "setup" | "active" | "break-warn" | "break-confirm" | "break-done";

// Production: 600 s (10 min) · Demo label shown alongside actual count
const BREAK_COOLDOWN_SEC = 600;

const RING_RADIUS = 72;
const RING_CIRC   = 2 * Math.PI * RING_RADIUS;

export function SSAModal({ cfg }: { cfg: SSAConfig }) {
  const day     = Math.min(cfg.daysSinceStart ?? 0, 31);
  const matured = day >= 31;

  const [step,    setStep]   = useState<SSAStep>(cfg.ajoId ? "active" : "disclose");
  const [scanning, setScan]  = useState(false);
  const [ajoId]              = useState(cfg.ajoId ?? `AJO-${Date.now()}`);
  const [countdown, setCD]   = useState(BREAK_COOLDOWN_SEC);
  const timerRef             = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start 10m-Rule countdown when user enters break-warn
  useEffect(() => {
    if (step === "break-warn") {
      setCD(BREAK_COOLDOWN_SEC);
      timerRef.current = setInterval(() => {
        setCD(p => {
          if (p <= 1) { clearInterval(timerRef.current!); return 0; }
          return p - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [step]);

  const simulateScan = (onDone: () => void) => {
    setScan(true);
    setTimeout(() => { setScan(false); onDone(); }, 2500);
  };

  const fmt = (s: number) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  // ── AJO Progress Ring (SVG) ───────────────────────────────────────────────
  const progress  = day / 31;
  const ringColor = matured ? "#22c55e" : "#c9a84c";
  const AjoRing   = (
    <svg width="180" height="180" viewBox="0 0 180 180" aria-label={`Day ${day} of 31`}>
      <circle cx="90" cy="90" r={RING_RADIUS} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10"/>
      <circle cx="90" cy="90" r={RING_RADIUS} fill="none" stroke={ringColor} strokeWidth="10"
        strokeLinecap="round" strokeDasharray={RING_CIRC}
        strokeDashoffset={RING_CIRC * (1 - progress)}
        transform="rotate(-90 90 90)"
        style={{transition:"stroke-dashoffset 1.2s ease"}}
      />
      <text x="90" y="84" textAnchor="middle" fill="#fff" fontSize="30" fontWeight="800"
        fontFamily="'Cormorant Garamond',serif">{day}</text>
      <text x="90" y="102" textAnchor="middle" fill="rgba(255,255,255,0.38)" fontSize="11"
        fontFamily="Inter,sans-serif">of 31 days</text>
    </svg>
  );

  return (
    <>
      <div className="sdk-header">
        <div>
          <span className="sdk-badge">F-Man SSA · Ajo Protocol</span>
          <div className="sdk-title">Secured Saving Account</div>
          <div className="sdk-subtitle">31-Day Lock · Biometric Safe · Ajo Cycle</div>
        </div>
      </div>

      {/* ── STEP 1: Day-1 Fee Disclosure ── */}
      {step === "disclose" && (<>
        <div className="sdk-info">
          <p><strong>Target Amount:</strong> ₦{cfg.targetAmount.toLocaleString()}</p>
          <p><strong>Lock Period:</strong> 31 days from activation</p>
          <p><strong>Early-Break Penalty:</strong> <span style={{color:"#ef4444",fontWeight:700}}>50% of saved balance</span></p>
          <p><strong>Access Gate:</strong> Biometric Ajo-Signature only</p>
          <p><strong>10m-Rule:</strong> 10-minute mandatory cooling-off before any early break</p>
        </div>
        <div className="sdk-penalty">
          <div className="sdk-penalty__icon">⚠️</div>
          <div className="sdk-penalty__title">Day-1 Fee Disclosure</div>
          <div className="sdk-penalty__body">
            By proceeding, you acknowledge that withdrawing before Day 31 will forfeit{" "}
            <strong>50% of your total saved balance</strong> as a liquidity penalty.
            A mandatory 10-minute cooling-off period applies before any early break is confirmed.
          </div>
        </div>
        <button className="sdk-btn sdk-btn--primary" onClick={() => setStep("setup")}>
          🔒 I Understand — Set My Ajo-Signature
        </button>
        {cfg.onAbort && <button className="sdk-btn sdk-btn--ghost" onClick={cfg.onAbort}>Cancel</button>}
      </>)}

      {/* ── STEP 2: Biometric Ajo-Signature Setup ── */}
      {step === "setup" && (<>
        <p style={{fontSize:"0.79rem",color:"rgba(255,255,255,0.55)",textAlign:"center",marginBottom:"1rem",lineHeight:1.6}}>
          Register your <strong style={{color:"#c9a84c"}}>Ajo-Signature</strong> fingerprint.
          This is the only biometric key that can open your savings safe.
        </p>
        <div className="sdk-scanner-wrap">
          <div
            className={`sdk-scanner ${scanning?"sdk-scanner--scanning":""}`}
            onClick={() => !scanning && simulateScan(() => setStep("active"))}
            style={{cursor:scanning?"default":"pointer"}}
          >
            {scanning && <><div className="sdk-scanner__ring"/><div className="sdk-scanner__ring"/></>}
            🔒
          </div>
          <p className="sdk-scan-label">
            {scanning ? <><strong>Registering Ajo-Signature…</strong><br/>Hold still</> : "Tap to register fingerprint"}
          </p>
        </div>
        <button className="sdk-btn sdk-btn--primary" onClick={() => !scanning && simulateScan(() => setStep("active"))} disabled={scanning}>
          {scanning ? "Registering…" : "👆 Register Ajo-Signature"}
        </button>
      </>)}

      {/* ── STEP 3: Active Ajo View (Progress Ring) ── */}
      {step === "active" && (<>
        <div className="sdk-ajo-ring">{AjoRing}</div>
        <div className="sdk-info">
          <p><strong>Ajo ID:</strong> {ajoId}</p>
          <p><strong>Status:</strong> {matured ? "✅ Matured — Ready to Withdraw" : `🔒 Locked · ${31-day} day(s) remaining`}</p>
          <p><strong>Target:</strong> ₦{cfg.targetAmount.toLocaleString()}</p>
        </div>
        {matured ? (
          <button className="sdk-btn sdk-btn--primary" onClick={() => cfg.onSuccess({
            fn:"SSA", status:"SUCCESS", ajoId,
            successToken:`SSA.${ajoId}.${Date.now()}`, timestamp:Date.now(),
          } satisfies SDKResult)}>
            💰 Withdraw Matured Savings
          </button>
        ) : (<>
          <button className="sdk-btn sdk-btn--danger" onClick={() => setStep("break-warn")}>
            🔓 Break the Safe (Early Withdrawal)
          </button>
          <button className="sdk-btn sdk-btn--ghost" onClick={cfg.onAbort}>Close</button>
        </>)}
      </>)}

      {/* ── STEP 4a: 10m-Rule Gate — Break Warning + Mandatory Cooling-off ── */}
      {step === "break-warn" && (<>
        <div className="sdk-penalty">
          <div className="sdk-penalty__icon">🚨</div>
          <div className="sdk-penalty__title">50% PENALTY APPLIES</div>
          <div className="sdk-penalty__body">
            You are breaking your Ajo safe on <strong>Day {day}</strong> of 31.
            Proceeding will permanently forfeit <strong>50%</strong> of your total saved balance.
            This cannot be reversed.
          </div>
        </div>

        {/* 10m-Rule Cooling-off Countdown */}
        <div className="sdk-countdown">
          <div className="sdk-countdown__num">{fmt(countdown)}</div>
          <div className="sdk-countdown__label">
            {countdown > 0 ? "10-Minute Mandatory Cooling-Off — Please Wait" : "Cooling-off complete. You may now proceed."}
          </div>
        </div>

        <button className="sdk-btn sdk-btn--danger" onClick={() => setStep("break-confirm")} disabled={countdown > 0}>
          {countdown > 0 ? `⏳ Wait ${fmt(countdown)}…` : "I Accept the 50% Penalty — Proceed"}
        </button>
        <button className="sdk-btn sdk-btn--ghost" onClick={() => setStep("active")}>← Go Back</button>
      </>)}

      {/* ── STEP 4b: Secondary Biometric Confirmation ── */}
      {step === "break-confirm" && (<>
        <p style={{fontSize:"0.79rem",color:"rgba(239,68,68,0.8)",textAlign:"center",marginBottom:"1rem",lineHeight:1.6}}>
          <strong>Final confirmation required.</strong> Scan your Ajo-Signature to confirm early withdrawal.
        </p>
        <div className="sdk-scanner-wrap">
          <div
            className={`sdk-scanner ${scanning?"sdk-scanner--scanning":""}`}
            style={{borderColor:"#ef4444",cursor:scanning?"default":"pointer"}}
            onClick={() => !scanning && simulateScan(() => setStep("break-done"))}
          >
            {scanning && <><div className="sdk-scanner__ring"/><div className="sdk-scanner__ring"/></>}
            🔓
          </div>
          <p className="sdk-scan-label" style={{color:"rgba(239,68,68,0.7)"}}>
            {scanning ? "Verifying Ajo-Signature…" : "Tap to confirm Break-the-Safe"}
          </p>
        </div>
        <button className="sdk-btn sdk-btn--danger" onClick={() => !scanning && simulateScan(() => setStep("break-done"))} disabled={scanning}>
          {scanning ? "Verifying…" : "🔓 Confirm Early Withdrawal"}
        </button>
      </>)}

      {/* ── STEP 4c: Break Complete — Penalty Applied ── */}
      {step === "break-done" && (
        <div className="sdk-result">
          <div className="sdk-result__icon">⚠️</div>
          <div className="sdk-result__title">Safe Broken — Penalty Applied</div>
          <div className="sdk-result__body">
            Your Ajo safe has been broken on Day {day}. A <strong style={{color:"#ef4444"}}>50% penalty</strong> has
            been deducted from your saved balance. Remaining funds are being released to your account.
          </div>
          <button className="sdk-btn sdk-btn--primary" onClick={() => cfg.onSuccess({
            fn:"SSA", status:"PENALTY_BREAK", ajoId,
            penaltyApplied:true, timestamp:Date.now(),
          } satisfies SDKResult)} style={{marginTop:"1rem"}}>
            Confirm &amp; Close
          </button>
        </div>
      )}
    </>
  );
}


