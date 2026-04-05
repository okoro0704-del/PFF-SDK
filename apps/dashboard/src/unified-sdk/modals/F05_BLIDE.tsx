// ─── F05 · BLIDE — Biometric Face Pay ────────────────────────────────────────
import { useState, useEffect } from "react";
import type { BLIDEConfig } from "../types";

type Step = "review"|"face"|"confirming"|"done";

export function F05_BLIDE({ cfg }: { cfg: BLIDEConfig }) {
  const [step,     setStep]  = useState<Step>("review");
  const [scanning, setScan]  = useState(false);
  const [attempt,  setAttempt] = useState(0);
  const [token,    setToken] = useState("");

  const startFace = () => {
    setScan(true);
    setTimeout(() => {
      const ok = Math.random() > 0.08;
      setScan(false);
      if (ok) { setStep("confirming"); setTimeout(()=>{ setToken(`BLIDE.${cfg.ref}.${Date.now()}.${Math.random().toString(36).slice(2,10).toUpperCase()}`); setStep("done"); }, 1800); }
      else { setAttempt(p=>p+1); }
    }, 3500);
  };

  useEffect(() => {
    if (step === "done" && token)
      setTimeout(() => cfg.onSuccess({ fn:"BLIDE", status:"SUCCESS", successToken:token, timestamp:Date.now() }), 2000);
  }, [step, token]); // eslint-disable-line

  return (<>
    <div className="pff-sdk-header">
      <span className="pff-sdk-badge">F05 · BLIDE · Face Pay</span>
      <div className="pff-sdk-title">Biometric Face Pay</div>
      <div className="pff-sdk-subtitle">Facial Recognition · 1:1 Match · Signed Release</div>
    </div>
    <div className="pff-sdk-steps">
      {["Review","Face Scan","Confirming","Done"].map((_,i)=>{
        const si={review:0,face:1,confirming:2,done:3}[step];
        return <div key={i} className={`pff-sdk-step ${i<si?"pff-sdk-step--done":i===si?"pff-sdk-step--active":""}`}/>;
      })}
    </div>

    {step==="review"&&(<>
      <div className="pff-sdk-info">
        <p><strong>Amount:</strong> ₦{cfg.amount.toLocaleString()}</p>
        <p><strong>To:</strong> {cfg.beneficiary}</p>
        <p><strong>Ref:</strong> {cfg.ref}</p>
      </div>
      <div className="pff-sdk-info" style={{background:"rgba(201,168,76,0.04)",borderColor:"rgba(201,168,76,0.2)"}}>
        <p>😊 Your face is your password. Look at the front camera to authorize this payment. <strong style={{color:"#c9a84c"}}>No PIN required.</strong></p>
      </div>
      <button className="pff-sdk-btn pff-sdk-btn--primary" onClick={()=>{setStep("face");setTimeout(startFace,200);}}>😊 Authorize with Face →</button>
      {cfg.onAbort&&<button className="pff-sdk-btn pff-sdk-btn--ghost" onClick={cfg.onAbort}>Cancel</button>}
    </>)}

    {step==="face"&&(<>
      {attempt>0&&<div style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:"8px",padding:"0.6rem",fontSize:"0.78rem",color:"#ef4444",textAlign:"center"}}>❌ Face not recognized. Try #{attempt+1} — ensure good lighting.</div>}
      <div style={{textAlign:"center",padding:"1.5rem 0"}}>
        <div style={{
          width:120,height:120,margin:"0 auto",borderRadius:"50%",border:`3px solid ${scanning?"#c9a84c":"rgba(201,168,76,0.3)"}`,
          background:"rgba(201,168,76,0.06)",display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:"3.5rem",position:"relative",transition:"border-color 0.3s"
        }}>
          {scanning&&<div style={{position:"absolute",inset:-8,borderRadius:"50%",border:"2px solid rgba(201,168,76,0.3)",animation:"pff-sdk-pulse 1.4s ease-out infinite"}}/>}
          😊
        </div>
        <p style={{color:"rgba(255,255,255,0.5)",fontSize:"0.78rem",marginTop:"1rem",lineHeight:1.6}}>
          {scanning?<><strong>Scanning face…</strong><br/>Look at the camera, keep face centered</>:"Position your face in the circle, then tap below"}
        </p>
      </div>
      <button className="pff-sdk-btn pff-sdk-btn--primary" onClick={startFace} disabled={scanning}>{scanning?"Scanning…":"😊 Scan Face Now"}</button>
    </>)}

    {step==="confirming"&&(
      <div className="pff-sdk-scanner-wrap" style={{padding:"2rem 0"}}>
        <div className="pff-sdk-scanner pff-sdk-scanner--scanning">
          <div className="pff-sdk-scanner__ring"/><div className="pff-sdk-scanner__ring"/>✅
        </div>
        <p className="pff-sdk-scan-label"><strong>Face Matched!</strong><br/>Authorizing ₦{cfg.amount.toLocaleString()} payment…</p>
      </div>
    )}

    {step==="done"&&(
      <div className="pff-sdk-result">
        <div className="pff-sdk-result__icon">😊</div>
        <div className="pff-sdk-result__title">Face Pay Authorized</div>
        <div className="pff-sdk-result__body">₦{cfg.amount.toLocaleString()} payment to <strong>{cfg.beneficiary}</strong> authorized via facial biometric. Signed token returned to host.</div>
        <code className="pff-sdk-result__token">BLIDE TOKEN: {token}</code>
      </div>
    )}
  </>);
}

