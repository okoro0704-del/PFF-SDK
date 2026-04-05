// ─── F09 · BEPWG — Biometric Enhanced Proximity Withdrawal Gate ───────────────
import { useState, useEffect, useRef } from "react";
import type { BEPWGConfig } from "../types";

type Step = "gps"|"proximity"|"auth"|"done"|"blocked";
const COOLDOWN = 600;

export function F09_BEPWG({ cfg }: { cfg: BEPWGConfig }) {
  const [step,     setStep]   = useState<Step>("gps");
  const [dist,     setDist]   = useState<number|null>(null);
  const [scanning, setScan]   = useState(false);
  const [token,    setToken]  = useState("");
  const [countdown, setCD]    = useState(COOLDOWN);
  const timerRef              = useRef<ReturnType<typeof setInterval>|null>(null);
  const maxDist = cfg.maxDistanceMeters ?? 100;
  const amtNaira = (cfg.amountMinor / 100).toLocaleString("en-NG", { maximumFractionDigits:2 });

  // Simulate GPS check
  const checkGps = () => {
    setTimeout(() => {
      const mockDist = Math.random() < 0.75 ? Math.floor(Math.random()*maxDist*0.9) : Math.floor(maxDist*1.3);
      setDist(mockDist);
      setStep(mockDist <= maxDist ? "proximity" : "blocked");
    }, 2200);
  };

  useEffect(() => { checkGps(); }, []); // eslint-disable-line

  useEffect(() => {
    if (step === "blocked") {
      setCD(COOLDOWN);
      timerRef.current = setInterval(() => setCD(p => { if(p<=1){clearInterval(timerRef.current!);return 0;}return p-1;}), 1000);
    }
    return () => { if(timerRef.current)clearInterval(timerRef.current); };
  }, [step]);

  const startAuth = () => {
    setScan(true);
    setTimeout(() => {
      setToken(`BEPWG.${cfg.ref}.${Date.now()}.${Math.random().toString(36).slice(2,10).toUpperCase()}`);
      setScan(false); setStep("done");
    }, 2800);
  };

  useEffect(() => {
    if (step === "done" && token)
      setTimeout(() => cfg.onSuccess({ fn:"BEPWG", status:"SUCCESS", successToken:token, timestamp:Date.now() }), 2000);
  }, [step, token]); // eslint-disable-line

  const fmt = (s: number) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  return (<>
    <div className="pff-sdk-header">
      <span className="pff-sdk-badge">F09 · BEPWG · Proximity Gate</span>
      <div className="pff-sdk-title">Proximity Withdrawal Gate</div>
      <div className="pff-sdk-subtitle">GPS Location Check · Biometric Auth · {maxDist}m Radius</div>
    </div>

    {step==="gps"&&(
      <div className="pff-sdk-scanner-wrap" style={{padding:"2.5rem 0"}}>
        <div className="pff-sdk-scanner pff-sdk-scanner--scanning">
          <div className="pff-sdk-scanner__ring"/><div className="pff-sdk-scanner__ring"/>📍
        </div>
        <p className="pff-sdk-scan-label"><strong>Checking GPS Location…</strong><br/>Verifying you are within {maxDist}m of the approved terminal</p>
      </div>
    )}

    {step==="proximity"&&(<>
      <div className="pff-sdk-verified-badge">✅ Location Verified — {dist}m from terminal</div>
      <div style={{textAlign:"center",padding:"1.25rem 0"}}>
        <div style={{position:"relative",width:160,height:160,margin:"0 auto"}}>
          <svg viewBox="0 0 160 160" width="160" height="160">
            <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(34,197,94,0.15)" strokeWidth="2" strokeDasharray="6 4"/>
            <circle cx="80" cy="80" r="45" fill="rgba(34,197,94,0.08)" stroke="rgba(34,197,94,0.3)" strokeWidth="1.5"/>
            <circle cx="80" cy="80" r="8" fill="#22c55e"/>
            <circle cx={80+Math.cos(0.4)*(dist??0)/maxDist*45} cy={80+Math.sin(0.4)*(dist??0)/maxDist*45} r="5" fill="#c9a84c"/>
          </svg>
          <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
            <div style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.5)"}}>Distance</div>
            <div style={{fontSize:"1.1rem",fontWeight:700,color:"#22c55e"}}>{dist}m</div>
          </div>
        </div>
      </div>
      <div className="pff-sdk-info">
        <p><strong>Withdrawal Ref:</strong> {cfg.ref}</p>
        <p><strong>Amount:</strong> ₦{amtNaira}</p>
        <p><strong>Location:</strong> ✅ Within {maxDist}m radius</p>
      </div>
      <button className="pff-sdk-btn pff-sdk-btn--primary" onClick={()=>setStep("auth")}>👆 Authorize Withdrawal →</button>
      {cfg.onAbort&&<button className="pff-sdk-btn pff-sdk-btn--ghost" onClick={cfg.onAbort}>Cancel</button>}
    </>)}

    {step==="auth"&&(<>
      <div className="pff-sdk-info"><p>Proximity confirmed. Biometric verification required to release ₦{amtNaira}.</p></div>
      <div className="pff-sdk-scanner-wrap">
        <div className={`pff-sdk-scanner ${scanning?"pff-sdk-scanner--scanning":""}`} onClick={()=>!scanning&&startAuth()} style={{cursor:scanning?"default":"pointer"}}>
          {scanning&&<><div className="pff-sdk-scanner__ring"/><div className="pff-sdk-scanner__ring"/></>}👆
        </div>
        <p className="pff-sdk-scan-label">{scanning?<><strong>Verifying Biometric…</strong><br/>Keep still</>:"Tap to scan fingerprint"}</p>
      </div>
      <button className="pff-sdk-btn pff-sdk-btn--primary" onClick={startAuth} disabled={scanning}>{scanning?"Verifying…":"👆 Scan to Release Funds"}</button>
    </>)}

    {step==="blocked"&&(<>
      <div className="pff-sdk-penalty">
        <div className="pff-sdk-penalty__icon">📍</div>
        <div className="pff-sdk-penalty__title">OUTSIDE PROXIMITY ZONE</div>
        <div className="pff-sdk-penalty__body">You are <strong>{dist}m</strong> from the approved terminal — maximum allowed is <strong>{maxDist}m</strong>. You cannot withdraw from this location. A 10-minute hold applies.</div>
      </div>
      <div className="pff-sdk-countdown">
        <div className="pff-sdk-countdown__num">{fmt(countdown)}</div>
        <div className="pff-sdk-countdown__label">{countdown>0?"Location Hold Active — Please Wait":"Hold expired. Move closer to the terminal and try again."}</div>
      </div>
      {cfg.onAbort&&<button className="pff-sdk-btn pff-sdk-btn--ghost" onClick={cfg.onAbort} style={{marginTop:"0.5rem"}}>Close</button>}
    </>)}

    {step==="done"&&(
      <div className="pff-sdk-result">
        <div className="pff-sdk-result__icon">💸</div>
        <div className="pff-sdk-result__title">Withdrawal Authorized</div>
        <div className="pff-sdk-result__body">₦{amtNaira} released via proximity biometric gate. Signed token returned to host.</div>
        <code className="pff-sdk-result__token">BEPWG TOKEN: {token}</code>
      </div>
    )}
  </>);
}

