// ─── F08 · SSA — Secured Saving Account / AJO Protocol ───────────────────────
import { useState, useEffect, useRef } from "react";
import type { SSAConfig } from "../types";

type Step = "disclose"|"setup"|"active"|"break-warn"|"break-confirm"|"break-done";
const COOLDOWN = 600;
const R = 72, C = 2 * Math.PI * R;

export function F08_SSA({ cfg }: { cfg: SSAConfig }) {
  const day     = Math.min(cfg.daysSinceStart ?? 0, 31);
  const matured = day >= 31;
  const [step,    setStep]  = useState<Step>(cfg.ajoId ? "active" : "disclose");
  const [scanning, setScan] = useState(false);
  const [ajoId]             = useState(cfg.ajoId ?? `AJO-${Date.now()}`);
  const [countdown, setCD]  = useState(COOLDOWN);
  const timerRef            = useRef<ReturnType<typeof setInterval>|null>(null);

  useEffect(() => {
    if (step === "break-warn") {
      setCD(COOLDOWN);
      timerRef.current = setInterval(() => setCD(p => { if(p<=1){clearInterval(timerRef.current!);return 0;}return p-1; }), 1000);
    } else { if(timerRef.current){clearInterval(timerRef.current);timerRef.current=null;} }
    return () => { if(timerRef.current)clearInterval(timerRef.current); };
  }, [step]);

  const scan = (cb: ()=>void) => { setScan(true); setTimeout(()=>{setScan(false);cb();},2500); };
  const fmt  = (s: number) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  const color = matured ? "#22c55e" : "#c9a84c";
  const Ring = (
    <svg width="180" height="180" viewBox="0 0 180 180">
      <circle cx="90" cy="90" r={R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10"/>
      <circle cx="90" cy="90" r={R} fill="none" stroke={color} strokeWidth="10"
        strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C*(1-day/31)}
        transform="rotate(-90 90 90)" style={{transition:"stroke-dashoffset 1.2s ease"}}/>
      <text x="90" y="84" textAnchor="middle" fill="#fff" fontSize="30" fontWeight="800" fontFamily="'Cormorant Garamond',serif">{day}</text>
      <text x="90" y="102" textAnchor="middle" fill="rgba(255,255,255,0.38)" fontSize="11" fontFamily="Inter,sans-serif">of 31 days</text>
    </svg>
  );

  return (<>
    <div className="pff-sdk-header">
      <span className="pff-sdk-badge">F08 · SSA · Ajo Protocol</span>
      <div className="pff-sdk-title">Secured Saving Account</div>
      <div className="pff-sdk-subtitle">31-Day Lock · Biometric Safe · Ajo Cycle</div>
    </div>

    {step==="disclose"&&(<>
      <div className="pff-sdk-info">
        <p><strong>Target:</strong> ₦{cfg.targetAmount.toLocaleString()}</p>
        <p><strong>Lock Period:</strong> 31 days</p>
        <p><strong>Early-Break Penalty:</strong> <span style={{color:"#ef4444",fontWeight:700}}>50% of balance</span></p>
        <p><strong>10m-Rule:</strong> 10-minute cooling-off before any early break</p>
      </div>
      <div className="pff-sdk-penalty">
        <div className="pff-sdk-penalty__icon">⚠️</div>
        <div className="pff-sdk-penalty__title">Day-1 Fee Disclosure</div>
        <div className="pff-sdk-penalty__body">Withdrawing before Day 31 forfeits <strong>50% of your saved balance</strong>. A 10-minute cooling-off applies.</div>
      </div>
      <button className="pff-sdk-btn pff-sdk-btn--primary" onClick={()=>setStep("setup")}>🔒 I Understand — Set My Ajo-Signature</button>
      {cfg.onAbort&&<button className="pff-sdk-btn pff-sdk-btn--ghost" onClick={cfg.onAbort}>Cancel</button>}
    </>)}

    {step==="setup"&&(<>
      <p style={{fontSize:"0.79rem",color:"rgba(255,255,255,0.55)",textAlign:"center",lineHeight:1.6}}>Register your <strong style={{color:"#c9a84c"}}>Ajo-Signature</strong> — the only biometric key that opens your safe.</p>
      <div className="pff-sdk-scanner-wrap">
        <div className={`pff-sdk-scanner ${scanning?"pff-sdk-scanner--scanning":""}`} onClick={()=>!scanning&&scan(()=>setStep("active"))} style={{cursor:scanning?"default":"pointer"}}>
          {scanning&&<><div className="pff-sdk-scanner__ring"/><div className="pff-sdk-scanner__ring"/></>}🔒
        </div>
        <p className="pff-sdk-scan-label">{scanning?<><strong>Registering…</strong><br/>Hold still</>:"Tap to register fingerprint"}</p>
      </div>
      <button className="pff-sdk-btn pff-sdk-btn--primary" onClick={()=>!scanning&&scan(()=>setStep("active"))} disabled={scanning}>{scanning?"Registering…":"👆 Register Ajo-Signature"}</button>
    </>)}

    {step==="active"&&(<>
      <div className="pff-sdk-ajo-ring">{Ring}</div>
      <div className="pff-sdk-info">
        <p><strong>Ajo ID:</strong> {ajoId}</p>
        <p><strong>Status:</strong> {matured?"✅ Matured — Ready to Withdraw":`🔒 Locked · ${31-day} day(s) remaining`}</p>
        <p><strong>Target:</strong> ₦{cfg.targetAmount.toLocaleString()}</p>
      </div>
      {matured
        ? <button className="pff-sdk-btn pff-sdk-btn--primary" onClick={()=>cfg.onSuccess({fn:"SSA",status:"SUCCESS",ajoId,successToken:`SSA.${ajoId}.${Date.now()}`,timestamp:Date.now()})}>💰 Withdraw Matured Savings</button>
        : <><button className="pff-sdk-btn pff-sdk-btn--danger" onClick={()=>setStep("break-warn")}>🔓 Break the Safe (Early Withdrawal)</button>
           <button className="pff-sdk-btn pff-sdk-btn--ghost" onClick={cfg.onAbort}>Close</button></>}
    </>)}

    {step==="break-warn"&&(<>
      <div className="pff-sdk-penalty">
        <div className="pff-sdk-penalty__icon">🚨</div>
        <div className="pff-sdk-penalty__title">50% PENALTY APPLIES</div>
        <div className="pff-sdk-penalty__body">Breaking your Ajo safe on Day {day} of 31. Proceeding forfeits <strong>50%</strong> of your total saved balance. This cannot be reversed.</div>
      </div>
      <div className="pff-sdk-countdown">
        <div className="pff-sdk-countdown__num">{fmt(countdown)}</div>
        <div className="pff-sdk-countdown__label">{countdown>0?"10-Minute Mandatory Cooling-Off":"Cooling-off complete. You may proceed."}</div>
      </div>
      <button className="pff-sdk-btn pff-sdk-btn--danger" onClick={()=>setStep("break-confirm")} disabled={countdown>0}>{countdown>0?`⏳ Wait ${fmt(countdown)}…`:"I Accept the 50% Penalty — Proceed"}</button>
      <button className="pff-sdk-btn pff-sdk-btn--ghost" onClick={()=>setStep("active")}>← Go Back</button>
    </>)}

    {step==="break-confirm"&&(<>
      <p style={{fontSize:"0.79rem",color:"rgba(239,68,68,0.8)",textAlign:"center",lineHeight:1.6}}><strong>Final confirmation.</strong> Scan your Ajo-Signature.</p>
      <div className="pff-sdk-scanner-wrap">
        <div className={`pff-sdk-scanner ${scanning?"pff-sdk-scanner--scanning":""}`} style={{borderColor:"#ef4444",cursor:scanning?"default":"pointer"}} onClick={()=>!scanning&&scan(()=>setStep("break-done"))}>
          {scanning&&<><div className="pff-sdk-scanner__ring"/><div className="pff-sdk-scanner__ring"/></>}🔓
        </div>
        <p className="pff-sdk-scan-label" style={{color:"rgba(239,68,68,0.7)"}}>{scanning?"Verifying Ajo-Signature…":"Tap to confirm Break-the-Safe"}</p>
      </div>
      <button className="pff-sdk-btn pff-sdk-btn--danger" onClick={()=>!scanning&&scan(()=>setStep("break-done"))} disabled={scanning}>{scanning?"Verifying…":"🔓 Confirm Early Withdrawal"}</button>
    </>)}

    {step==="break-done"&&(
      <div className="pff-sdk-result">
        <div className="pff-sdk-result__icon">⚠️</div>
        <div className="pff-sdk-result__title">Safe Broken — Penalty Applied</div>
        <div className="pff-sdk-result__body">Your Ajo safe was broken on Day {day}. <strong style={{color:"#ef4444"}}>50% penalty</strong> deducted. Remaining funds are being released.</div>
        <button className="pff-sdk-btn pff-sdk-btn--primary" onClick={()=>cfg.onSuccess({fn:"SSA",status:"PENALTY_BREAK",ajoId,penaltyApplied:true,timestamp:Date.now()})} style={{marginTop:"1rem"}}>Confirm &amp; Close</button>
      </div>
    )}
  </>);
}

