// ─── F07 · YES CALL — Biometric Transaction Gate ─────────────────────────────
import { useState, useEffect } from "react";
import type { YesCallConfig } from "../types";

type Step = "review"|"scanning"|"success"|"retry"|"blocked";
const MAX = 2;
const mint = (ref: string) => `BSSS.${ref}.${Date.now()}.${Math.random().toString(36).slice(2,12).toUpperCase()}`;

export function F07_YES({ cfg }: { cfg: YesCallConfig }) {
  const [step, setStep]         = useState<Step>("review");
  const [attempts, setAttempts] = useState(0);
  const [token]                 = useState(() => mint(cfg.ref));

  const startScan = () => {
    setStep("scanning");
    setTimeout(() => {
      const matched = Math.random() > 0.10;
      if (matched) { setStep("success"); }
      else { const n=attempts+1; setAttempts(n); setStep(n>=MAX?"blocked":"retry"); }
    }, 3000);
  };

  useEffect(() => {
    if (step === "success")
      setTimeout(() => cfg.onSuccess({ fn:"YES_CALL", status:"SUCCESS", successToken:token, timestamp:Date.now() }), 2200);
  }, [step]); // eslint-disable-line

  return (<>
    <div className="pff-sdk-header">
      <span className="pff-sdk-badge">F07 · YES CALL · BSSS Protocol</span>
      <div className="pff-sdk-title">Transaction Authorization</div>
      <div className="pff-sdk-subtitle">Biometric Gate · 1:1 Match · Signed Release</div>
    </div>
    <div className="pff-sdk-steps">
      {["Review","Scan","Authorized"].map((_,i)=>(
        <div key={i} className={`pff-sdk-step ${i<(step!=="review"?1:0)||step==="success"&&i<3?"pff-sdk-step--done":""}`}/>
      ))}
    </div>

    {step==="review"&&(<>
      <div className="pff-sdk-info">
        <p><strong>Amount:</strong> ₦{cfg.amount.toLocaleString()}</p>
        <p><strong>To:</strong> {cfg.beneficiary}</p>
        <p><strong>Ref:</strong> {cfg.ref}</p>
        {cfg.narration&&<p><strong>Narration:</strong> {cfg.narration}</p>}
      </div>
      <p style={{fontSize:"0.78rem",color:"rgba(255,255,255,0.45)",lineHeight:1.65}}>
        Place your enrolled finger on the sensor. The host app only receives a <strong style={{color:"#c9a84c"}}>signed SUCCESS_TOKEN</strong>.
      </p>
      <button className="pff-sdk-btn pff-sdk-btn--primary" onClick={startScan}>👆 Authenticate &amp; Release Funds</button>
      {cfg.onAbort&&<button className="pff-sdk-btn pff-sdk-btn--ghost" onClick={cfg.onAbort}>Cancel Transaction</button>}
    </>)}

    {step==="scanning"&&(
      <div className="pff-sdk-scanner-wrap">
        <div className="pff-sdk-scanner pff-sdk-scanner--scanning">
          <div className="pff-sdk-scanner__ring"/><div className="pff-sdk-scanner__ring"/>👆
        </div>
        <p className="pff-sdk-scan-label"><strong>Scanning…</strong><br/>Keep your finger still on the sensor</p>
      </div>
    )}

    {step==="success"&&(
      <div className="pff-sdk-result">
        <div className="pff-sdk-result__icon">✅</div>
        <div className="pff-sdk-result__title">Biometric Match Confirmed</div>
        <div className="pff-sdk-result__body">Transaction authorized via BSSS Protocol. Releasing funds now.</div>
        <code className="pff-sdk-result__token">SUCCESS_TOKEN: {token}</code>
      </div>
    )}

    {step==="retry"&&(<>
      <div className="pff-sdk-result">
        <div className="pff-sdk-result__icon">❌</div>
        <div className="pff-sdk-result__title">Biometric Match Failed</div>
        <div className="pff-sdk-result__body">Attempt {attempts}/{MAX}. Use the same finger registered during enrollment.</div>
      </div>
      <button className="pff-sdk-btn pff-sdk-btn--primary" onClick={startScan}>🔄 Retry Scan</button>
    </>)}

    {step==="blocked"&&(
      <div className="pff-sdk-result">
        <div className="pff-sdk-result__icon">🔒</div>
        <div className="pff-sdk-result__title">Transaction Blocked</div>
        <div className="pff-sdk-result__body">Maximum biometric attempts exceeded. Transaction flagged. Contact your bank.</div>
        {cfg.onAbort&&<button className="pff-sdk-btn pff-sdk-btn--danger" onClick={cfg.onAbort} style={{marginTop:"1rem"}}>Dismiss</button>}
      </div>
    )}
  </>);
}

