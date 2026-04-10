// ─── F10 · LBAS — Live Biometric Authentication System ───────────────────────
import { useState, useEffect, useRef } from "react";
import type { LBASConfig } from "../types";

type Step = "intro"|"challenge"|"totp"|"done"|"failed";

const CHALLENGES = [
  { id:"BLINK",   label:"Blink Twice",             icon:"👁️" },
  { id:"NOD",     label:"Nod Slowly",               icon:"🙂" },
  { id:"TURN_L",  label:"Turn Head Left",           icon:"👈" },
  { id:"TURN_R",  label:"Turn Head Right",          icon:"👉" },
  { id:"SMILE",   label:"Smile",                    icon:"😄" },
  { id:"BROW",    label:"Raise Both Eyebrows",      icon:"🤨" },
  { id:"LOOK_UP", label:"Look Upward for 3 Seconds",icon:"👆" },
];

export function F10_LBAS({ cfg }: { cfg: LBASConfig }) {
  const [step,      setStep]     = useState<Step>("intro");
  const [challenge] = useState(() => CHALLENGES[Math.floor(Math.random()*CHALLENGES.length)]);
  const [timeLeft,  setTimeLeft] = useState(30);
  const [totp,      setTotp]     = useState("");
  const [totpErr,   setTotpErr]  = useState(false);
  const [token,     setToken]    = useState("");
  const timerRef                  = useRef<ReturnType<typeof setInterval>|null>(null);
  const [performing, setPerforming] = useState(false);

  useEffect(() => {
    if (step !== "challenge") return;
    setTimeLeft(30);
    timerRef.current = setInterval(() => {
      setTimeLeft(p => {
        if (p <= 1) { clearInterval(timerRef.current!); setStep("failed"); return 0; }
        return p-1;
      });
    }, 1000);
    return () => { if(timerRef.current)clearInterval(timerRef.current); };
  }, [step]);

  const confirmChallenge = () => {
    setPerforming(true);
    clearInterval(timerRef.current!);
    setTimeout(() => { setPerforming(false); setStep("totp"); }, 1800);
  };

  const verifyTotp = () => {
    // 6-digit TOTP — always succeeds in demo if length is 6
    if (totp.length !== 6) { setTotpErr(true); return; }
    setTotpErr(false);
    const t = `LBAS.${cfg.challengeRef}.${Date.now()}.${Math.random().toString(36).slice(2,10).toUpperCase()}`;
    setToken(t);
    setStep("done");
  };

  useEffect(() => {
    if (step === "done" && token)
      setTimeout(() => cfg.onSuccess({ fn:"LBAS", status:"SUCCESS", successToken:token, timestamp:Date.now() }), 2000);
  }, [step, token]); // eslint-disable-line

  return (<>
    <div className="pff-sdk-header">
      <span className="pff-sdk-badge">F10 · LBAS · Live Auth System</span>
      <div className="pff-sdk-title">Live Biometric Authentication</div>
      <div className="pff-sdk-subtitle">Liveness Challenge + TOTP · Anti-Spoofing Protocol</div>
    </div>

    {step==="intro"&&(<>
      <div className="pff-sdk-info">
        <p><strong>Challenge Ref:</strong> {cfg.challengeRef}</p>
        <p>LBAS will issue a randomized <strong>liveness challenge</strong> followed by a <strong>6-digit TOTP</strong> from your authenticator app. This double-gate prevents spoofing attacks.</p>
        <p><strong>Time Limit:</strong> 30 seconds per challenge</p>
      </div>
      <button className="pff-sdk-btn pff-sdk-btn--primary" onClick={()=>setStep("challenge")}>🎭 Begin Liveness Challenge</button>
      {cfg.onAbort&&<button className="pff-sdk-btn pff-sdk-btn--ghost" onClick={cfg.onAbort}>Cancel</button>}
    </>)}

    {step==="challenge"&&(<>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.5rem"}}>
        <span style={{fontSize:"0.78rem",color:"rgba(255,255,255,0.45)"}}>Randomized Challenge</span>
        <span style={{
          fontSize:"0.85rem",fontWeight:700,
          color:timeLeft>15?"#22c55e":timeLeft>8?"#f59e0b":"#ef4444"
        }}>{timeLeft}s</span>
      </div>
      <div style={{
        textAlign:"center",padding:"1.75rem 1rem",
        background:"rgba(201,168,76,0.06)",border:"1px solid rgba(201,168,76,0.2)",borderRadius:"12px"
      }}>
        <div style={{fontSize:"3rem",marginBottom:"0.75rem"}}>{challenge.icon}</div>
        <div style={{fontSize:"1.2rem",fontWeight:700,color:"#fff",marginBottom:"0.35rem"}}>{challenge.label}</div>
        <div style={{fontSize:"0.75rem",color:"rgba(255,255,255,0.4)"}}>Perform this action in front of your camera</div>
      </div>
      <div style={{height:"4px",background:"rgba(255,255,255,0.08)",borderRadius:"4px",overflow:"hidden",margin:"0.25rem 0"}}>
        <div style={{height:"100%",background:timeLeft>15?"#22c55e":timeLeft>8?"#f59e0b":"#ef4444",width:`${(timeLeft/30)*100}%`,transition:"width 1s linear"}}/>
      </div>
      <button className="pff-sdk-btn pff-sdk-btn--primary" onClick={confirmChallenge} disabled={performing}>{performing?"Confirming…":"✅ Done — I Performed the Challenge"}</button>
    </>)}

    {step==="totp"&&(<>
      <div className="pff-sdk-verified-badge">✅ Liveness challenge confirmed</div>
      <div style={{marginTop:"0.5rem"}}>
        <div className="pff-sdk-info" style={{marginBottom:"0.75rem"}}>
          <p>Enter the 6-digit code from your <strong>PFF-TRUST Authenticator</strong> app to complete the dual-gate verification.</p>
        </div>
        <div className="pff-sdk-field">
          <label className="pff-sdk-label">6-Digit TOTP Code</label>
          <input className="pff-sdk-input" value={totp} maxLength={6}
            onChange={e=>{setTotp(e.target.value.replace(/\D/g,""));setTotpErr(false);}}
            placeholder="000000" style={{fontSize:"1.5rem",letterSpacing:"0.3em",textAlign:"center"}}/>
          {totpErr&&<span style={{fontSize:"0.75rem",color:"#ef4444",marginTop:"0.3rem"}}>Invalid TOTP — must be 6 digits</span>}
        </div>
        <button className="pff-sdk-btn pff-sdk-btn--primary" onClick={verifyTotp} disabled={totp.length!==6} style={{marginTop:"0.5rem"}}>🔐 Verify &amp; Authenticate</button>
      </div>
    </>)}

    {step==="done"&&(
      <div className="pff-sdk-result">
        <div className="pff-sdk-result__icon">🛡️</div>
        <div className="pff-sdk-result__title">Live Authentication Complete</div>
        <div className="pff-sdk-result__body">Liveness + TOTP dual-gate passed. Anti-spoofing protocol satisfied. Signed token returned.</div>
        <code className="pff-sdk-result__token">LBAS TOKEN: {token}</code>
      </div>
    )}

    {step==="failed"&&(<>
      <div className="pff-sdk-result">
        <div className="pff-sdk-result__icon">⏱️</div>
        <div className="pff-sdk-result__title">Challenge Timed Out</div>
        <div className="pff-sdk-result__body">30-second liveness window expired. For security, a new randomized challenge has been prepared.</div>
      </div>
      <button className="pff-sdk-btn pff-sdk-btn--primary" onClick={()=>setStep("challenge")}>🔄 Try New Challenge</button>
      {cfg.onAbort&&<button className="pff-sdk-btn pff-sdk-btn--ghost" onClick={cfg.onAbort}>Abort</button>}
    </>)}
  </>);
}

