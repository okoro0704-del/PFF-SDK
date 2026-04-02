// ─── PFF-TRUST · SDK Integration Hub ─────────────────────────────────────────
// Demonstrates all 3 SDK functions; also serves as the integration guide
// for partner banks connecting their apps to the F-Man Life OS Middleware.

import { useState } from "react";
import { useBiometricSDK } from "../sdk/BiometricSDK";
import type { SDKResult } from "../sdk/types";

interface Props { onBack: () => void; }

export function SdkLaunchPage({ onBack }: Props) {
  const { launch } = useBiometricSDK();
  const [lastResult, setResult] = useState<SDKResult | null>(null);

  const capture = (r: SDKResult) => setResult(r);

  return (
    <div style={{ maxWidth:900, margin:"0 auto", padding:"2.5rem 2rem" }}>

      {/* Back */}
      <button className="btn btn--ghost btn--sm" onClick={onBack} style={{marginBottom:"2rem"}}>
        ← Back to Core
      </button>

      {/* Header */}
      <div style={{marginBottom:"2.5rem"}}>
        <p style={{fontSize:"0.62rem",letterSpacing:"0.18em",color:"var(--gold)",textTransform:"uppercase",marginBottom:"0.5rem"}}>
          F-Man Life OS Middleware · BSSS Protocol
        </p>
        <h1 style={{fontSize:"2rem",fontWeight:800,color:"var(--gold-bright)",marginBottom:"0.5rem"}}>
          Universal Biometric SDK
        </h1>
        <p style={{color:"var(--text-muted)",fontSize:"0.88rem",maxWidth:620,lineHeight:1.7}}>
          A force-injected, non-dismissible sovereign UI that partner banks embed in their apps.
          The SDK handles all biometric operations internally — the host app only receives signed tokens or account numbers.
        </p>
      </div>

      {/* ── 3 Function Cards ── */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:"1.5rem",marginBottom:"2.5rem"}}>

        {/* BAS */}
        <div className="card">
          <span style={{fontSize:"2.5rem",display:"block",marginBottom:"0.75rem"}}>🏦</span>
          <p style={{fontSize:"0.6rem",letterSpacing:"0.15em",color:"var(--gold)",textTransform:"uppercase",marginBottom:"0.35rem"}}>
            Function 1 — BAS
          </p>
          <h3 style={{fontSize:"1rem",color:"#fff",marginBottom:"0.5rem"}}>Biometric Account Setup</h3>
          <p style={{fontSize:"0.78rem",color:"var(--text-muted)",lineHeight:1.65,marginBottom:"1.25rem"}}>
            Tier-1 / Tier-3 account creation with 10-finger enrollment and real-time NIBSS BVN/NIN
            verification. Account number is force-pushed to the host app's database on success.
          </p>
          <div style={{display:"flex",gap:"0.5rem",flexWrap:"wrap"}}>
            <button className="btn btn--gold" onClick={() => launch({
              fn:"BAS", cfg:{ tier:1, hostAppId:"PFF-PORTAL", onSuccess:capture, onAbort:()=>{} }
            })}>Tier-1 →</button>
            <button className="btn btn--outline" onClick={() => launch({
              fn:"BAS", cfg:{ tier:3, hostAppId:"PFF-PORTAL", onSuccess:capture, onAbort:()=>{} }
            })}>Tier-3 →</button>
          </div>
        </div>

        {/* YES CALL */}
        <div className="card">
          <span style={{fontSize:"2.5rem",display:"block",marginBottom:"0.75rem"}}>👆</span>
          <p style={{fontSize:"0.6rem",letterSpacing:"0.15em",color:"var(--gold)",textTransform:"uppercase",marginBottom:"0.35rem"}}>
            Function 2 — YES CALL
          </p>
          <h3 style={{fontSize:"1rem",color:"#fff",marginBottom:"0.5rem"}}>Biometric Transaction Gate</h3>
          <p style={{fontSize:"0.78rem",color:"var(--text-muted)",lineHeight:1.65,marginBottom:"1.25rem"}}>
            Replaces the host app's PIN screen with the F-Man Biometric Gate.
            A 1:1 BSSS match returns a signed <code style={{color:"var(--gold)"}}>SUCCESS_TOKEN</code>.
            Raw biometrics never leave the device.
          </p>
          <button className="btn btn--gold" onClick={() => launch({
            fn:"YES_CALL", cfg:{
              hostAppId:"PFF-PORTAL", ref:`TXN-${Date.now()}`,
              amount:50000, beneficiary:"Zenith Bank · 2034567890",
              narration:"School Fees Payment", onSuccess:capture, onAbort:()=>{},
            }
          })}>Launch YES Call →</button>
        </div>

        {/* SSA / AJO */}
        <div className="card">
          <span style={{fontSize:"2.5rem",display:"block",marginBottom:"0.75rem"}}>🔒</span>
          <p style={{fontSize:"0.6rem",letterSpacing:"0.15em",color:"var(--gold)",textTransform:"uppercase",marginBottom:"0.35rem"}}>
            Function 3 — SSA / AJO
          </p>
          <h3 style={{fontSize:"1rem",color:"#fff",marginBottom:"0.5rem"}}>Secured Saving Account</h3>
          <p style={{fontSize:"0.78rem",color:"var(--text-muted)",lineHeight:1.65,marginBottom:"1.25rem"}}>
            31-day biometric lock with Ajo Progress Ring. Early break triggers the 10-Minute Rule Gate
            and a 50% penalty disclosure before secondary biometric confirmation.
          </p>
          <div style={{display:"flex",gap:"0.5rem",flexWrap:"wrap"}}>
            <button className="btn btn--gold" onClick={() => launch({
              fn:"SSA", cfg:{ hostAppId:"PFF-PORTAL", targetAmount:100000, daysSinceStart:0, onSuccess:capture, onAbort:()=>{} }
            })}>New Ajo →</button>
            <button className="btn btn--outline" onClick={() => launch({
              fn:"SSA", cfg:{ hostAppId:"PFF-PORTAL", targetAmount:100000, ajoId:"AJO-DEMO-001", daysSinceStart:12, onSuccess:capture, onAbort:()=>{} }
            })}>Day-12 (Locked)</button>
            <button className="btn btn--outline" onClick={() => launch({
              fn:"SSA", cfg:{ hostAppId:"PFF-PORTAL", targetAmount:100000, ajoId:"AJO-DEMO-002", daysSinceStart:31, onSuccess:capture, onAbort:()=>{} }
            })}>Day-31 (Matured)</button>
          </div>
        </div>

      </div>

      {/* Last SDK Result */}
      {lastResult && (
        <div style={{background:"rgba(201,168,76,0.04)",border:"1px solid rgba(201,168,76,0.18)",borderRadius:12,padding:"1.25rem 1.5rem"}}>
          <p style={{fontSize:"0.62rem",color:"var(--gold)",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:"0.5rem"}}>
            Last SDK Result
          </p>
          <p style={{fontSize:"0.75rem",color:"rgba(255,255,255,0.5)",marginBottom:"0.4rem"}}>
            <strong style={{color:"var(--gold-bright)"}}>Function:</strong> {lastResult.fn} &nbsp;·&nbsp;
            <strong style={{color:lastResult.status==="SUCCESS"?"#22c55e":"#ef4444"}}>{lastResult.status}</strong>
          </p>
          {lastResult.successToken  && <code style={{fontSize:"0.67rem",color:"var(--gold)",display:"block",wordBreak:"break-all"}}>{lastResult.successToken}</code>}
          {lastResult.accountNumber && <code style={{fontSize:"0.67rem",color:"#22c55e",display:"block"}}>{lastResult.accountNumber}</code>}
          {lastResult.ajoId         && <code style={{fontSize:"0.67rem",color:"var(--gold)",display:"block"}}>{lastResult.ajoId}</code>}
        </div>
      )}

    </div>
  );
}

