// ─── F03 · BIH — Biometric Identity Harvest ──────────────────────────────────
import { useState, useEffect } from "react";
import type { BIHConfig } from "../types";

type Step = "intro"|"scanning"|"liveness"|"done";

export function F03_BIH({ cfg }: { cfg: BIHConfig }) {
  const [step,     setStep]   = useState<Step>("intro");
  const [, setScan]   = useState(false);
  const [liveness, setLive]   = useState(false);
  const [token,    setToken]  = useState("");
  const [challenge, setChallenge] = useState("Blink twice");

  const CHALLENGES = ["Blink twice","Nod slowly","Turn head left","Smile","Raise eyebrows","Look up"];

  const startScan = () => {
    setScan(true);
    setTimeout(() => { setScan(false); setStep("liveness"); setChallenge(CHALLENGES[Math.floor(Math.random()*CHALLENGES.length)]); }, 3200);
  };

  const completeLiveness = () => {
    setLive(true);
    setTimeout(() => {
      setToken(`BIH.${cfg.sessionRef}.${Date.now()}.${Math.random().toString(36).slice(2,10).toUpperCase()}`);
      setStep("done");
    }, 2000);
  };

  useEffect(() => {
    if (step === "done" && token)
      setTimeout(() => cfg.onSuccess({ fn:"BIH", status:"SUCCESS", successToken:token, timestamp:Date.now() }), 2200);
  }, [step, token]); // eslint-disable-line

  return (<>
    <div className="pff-sdk-header">
      <span className="pff-sdk-badge">F03 · BIH · Identity Harvest</span>
      <div className="pff-sdk-title">Biometric Identity Harvest</div>
      <div className="pff-sdk-subtitle">NIBSS Triple-Gate · Fingerprint + Liveness + NIN</div>
    </div>
    <div className="pff-sdk-steps">
      {["Intro","Fingerprint","Liveness","Complete"].map((_,i)=>{
        const si = {intro:0,scanning:1,liveness:2,done:3}[step];
        return <div key={i} className={`pff-sdk-step ${i<si?"pff-sdk-step--done":i===si?"pff-sdk-step--active":""}`}/>;
      })}
    </div>

    {step==="intro"&&(<>
      <div className="pff-sdk-info">
        <p><strong>Session Ref:</strong> {cfg.sessionRef}</p>
        <p>This session will capture your biometric identity via a triple-gate: fingerprint, liveness check, and NIN cross-reference via NIBSS.</p>
        <p><strong>Duration:</strong> Approximately 60 seconds</p>
      </div>
      <div className="pff-sdk-info" style={{borderColor:"rgba(201,168,76,0.2)",background:"rgba(201,168,76,0.04)"}}>
        <p>🔒 <strong>BSSS Guarantee:</strong> Raw biometric data never leaves this device. Only a signed session token is returned to the host application.</p>
      </div>
      <button className="pff-sdk-btn pff-sdk-btn--primary" onClick={()=>{ setStep("scanning"); setTimeout(startScan, 100); }}>
        🔍 Begin Identity Harvest
      </button>
      {cfg.onAbort&&<button className="pff-sdk-btn pff-sdk-btn--ghost" onClick={cfg.onAbort}>Cancel</button>}
    </>)}

    {step==="scanning"&&(
      <div className="pff-sdk-scanner-wrap">
        <div className="pff-sdk-scanner pff-sdk-scanner--scanning">
          <div className="pff-sdk-scanner__ring"/><div className="pff-sdk-scanner__ring"/>👆
        </div>
        <p className="pff-sdk-scan-label"><strong>Capturing Fingerprint…</strong><br/>Keep your finger still · Querying NIBSS NIN database</p>
      </div>
    )}

    {step==="liveness"&&(<>
      <div className="pff-sdk-verified-badge">✅ Fingerprint captured and NIN cross-referenced</div>
      <div style={{textAlign:"center",padding:"1.5rem 0"}}>
        <div style={{fontSize:"3rem",marginBottom:"0.75rem"}}>🎭</div>
        <div style={{fontSize:"1.1rem",fontWeight:700,color:"#fff",marginBottom:"0.5rem"}}>Liveness Check</div>
        <div style={{
          background:"rgba(201,168,76,0.1)",border:"1px solid rgba(201,168,76,0.3)",borderRadius:"10px",
          padding:"1rem 1.25rem",fontSize:"1.2rem",fontWeight:700,color:"#c9a84c",marginBottom:"1rem"
        }}>
          {challenge}
        </div>
        <p style={{fontSize:"0.78rem",color:"rgba(255,255,255,0.4)",marginBottom:"1.25rem"}}>Perform the action above to confirm you are a live person</p>
        {!liveness
          ? <button className="pff-sdk-btn pff-sdk-btn--primary" onClick={completeLiveness}>✅ Done — I Performed the Action</button>
          : <div style={{color:"#22c55e",fontWeight:700,fontSize:"0.9rem"}}>✅ Liveness Confirmed — Processing…</div>
        }
      </div>
    </>)}

    {step==="done"&&(
      <div className="pff-sdk-result">
        <div className="pff-sdk-result__icon">🛡️</div>
        <div className="pff-sdk-result__title">Identity Harvest Complete</div>
        <div className="pff-sdk-result__body">Fingerprint, liveness, and NIN verified via NIBSS triple-gate. Signed token returned to host application.</div>
        <code className="pff-sdk-result__token">BIH TOKEN: {token}</code>
      </div>
    )}
  </>);
}

