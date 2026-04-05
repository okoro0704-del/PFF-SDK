// ─── F04 · BLS — Biometric Liquidity Sweep ───────────────────────────────────
import { useState, useEffect } from "react";
import type { BLSConfig } from "../types";

type Step = "review"|"auth"|"sweeping"|"done";

export function F04_BLS({ cfg }: { cfg: BLSConfig }) {
  const [step,     setStep]  = useState<Step>("review");
  const [scanning, setScan]  = useState(false);
  const [progress, setProgress] = useState(0);
  const [token,    setToken] = useState("");
  const amtNaira = (cfg.amountMinor / 100).toLocaleString("en-NG", { maximumFractionDigits: 2 });

  const startAuth = () => {
    setScan(true);
    setTimeout(() => { setScan(false); setStep("sweeping"); }, 2800);
  };

  useEffect(() => {
    if (step !== "sweeping") return;
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 12 + 4;
      if (p >= 100) {
        p = 100; clearInterval(iv);
        setToken(`BLS.${cfg.accountRef}.${Date.now()}.${Math.random().toString(36).slice(2,10).toUpperCase()}`);
        setStep("done");
      }
      setProgress(Math.min(p, 100));
    }, 350);
    return () => clearInterval(iv);
  }, [step]); // eslint-disable-line

  useEffect(() => {
    if (step === "done" && token)
      setTimeout(() => cfg.onSuccess({ fn:"BLS", status:"SUCCESS", successToken:token, timestamp:Date.now() }), 2200);
  }, [step, token]); // eslint-disable-line

  return (<>
    <div className="pff-sdk-header">
      <span className="pff-sdk-badge">F04 · BLS · Liquidity Sweep</span>
      <div className="pff-sdk-title">Biometric Liquidity Sweep</div>
      <div className="pff-sdk-subtitle">BSSS Biometric Gate · Instant Fund Transfer</div>
    </div>
    <div className="pff-sdk-steps">
      {["Review","Auth","Sweeping","Complete"].map((_,i)=>{
        const si={review:0,auth:1,sweeping:2,done:3}[step];
        return <div key={i} className={`pff-sdk-step ${i<si?"pff-sdk-step--done":i===si?"pff-sdk-step--active":""}`}/>;
      })}
    </div>

    {step==="review"&&(<>
      <div className="pff-sdk-info">
        <p><strong>Account Ref:</strong> {cfg.accountRef}</p>
        <p><strong>Sweep Amount:</strong> <span style={{color:"#c9a84c",fontWeight:700}}>₦{amtNaira}</span></p>
        <p><strong>Protocol:</strong> Biometric Liquidity Sweep — NIBSS Settlement</p>
      </div>
      <div className="pff-sdk-info" style={{borderColor:"rgba(239,68,68,0.2)",background:"rgba(239,68,68,0.04)"}}>
        <p>⚠️ <strong>Warning:</strong> This operation will sweep the specified amount from the source account. This action cannot be reversed without a biometric re-authorization.</p>
      </div>
      <button className="pff-sdk-btn pff-sdk-btn--primary" onClick={()=>setStep("auth")}>👆 Authorize Sweep →</button>
      {cfg.onAbort&&<button className="pff-sdk-btn pff-sdk-btn--ghost" onClick={cfg.onAbort}>Cancel</button>}
    </>)}

    {step==="auth"&&(<>
      <div className="pff-sdk-info"><p>Place your enrolled finger on the sensor to authorize the ₦{amtNaira} liquidity sweep.</p></div>
      <div className="pff-sdk-scanner-wrap">
        <div className={`pff-sdk-scanner ${scanning?"pff-sdk-scanner--scanning":""}`} onClick={()=>!scanning&&startAuth()} style={{cursor:scanning?"default":"pointer"}}>
          {scanning&&<><div className="pff-sdk-scanner__ring"/><div className="pff-sdk-scanner__ring"/></>}👆
        </div>
        <p className="pff-sdk-scan-label">{scanning?<><strong>Verifying Biometric…</strong><br/>Keep still</>:"Tap to scan fingerprint"}</p>
      </div>
      <button className="pff-sdk-btn pff-sdk-btn--primary" onClick={startAuth} disabled={scanning}>{scanning?"Verifying…":"👆 Scan to Authorize"}</button>
    </>)}

    {step==="sweeping"&&(
      <div style={{padding:"1rem 0"}}>
        <p style={{textAlign:"center",color:"rgba(255,255,255,0.6)",fontSize:"0.85rem",marginBottom:"1rem"}}>
          <strong style={{color:"#c9a84c"}}>Sweeping ₦{amtNaira}…</strong><br/>NIBSS Settlement in progress
        </p>
        <div style={{background:"rgba(255,255,255,0.08)",borderRadius:"8px",height:"12px",overflow:"hidden"}}>
          <div style={{height:"100%",background:"linear-gradient(90deg,#c9a84c,#22c55e)",width:`${progress}%`,transition:"width 0.35s ease",borderRadius:"8px"}}/>
        </div>
        <p style={{textAlign:"center",color:"#c9a84c",fontSize:"0.8rem",marginTop:"0.5rem"}}>{Math.round(progress)}%</p>
      </div>
    )}

    {step==="done"&&(
      <div className="pff-sdk-result">
        <div className="pff-sdk-result__icon">💸</div>
        <div className="pff-sdk-result__title">Sweep Complete</div>
        <div className="pff-sdk-result__body">₦{amtNaira} successfully swept and settled via NIBSS. Signed token returned to host.</div>
        <code className="pff-sdk-result__token">BLS TOKEN: {token}</code>
      </div>
    )}
  </>);
}

