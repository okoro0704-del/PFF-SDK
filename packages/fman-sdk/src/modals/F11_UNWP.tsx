// ─── F11 · UNWP — Unbanked Withdrawal Protocol ───────────────────────────────
import { useState } from "react";
import type { UNWPConfig } from "../types";

type Step = "intro"|"challenge"|"ledger"|"auth"|"done";

const TASKS = [
  { q:"What is 7 × 8?",          a:"56"  },
  { q:"Spell 'verify' backwards", a:"yfirev" },
  { q:"What month comes after October?", a:"november" },
  { q:"What is 144 ÷ 12?",       a:"12"  },
  { q:"How many sides does a hexagon have?", a:"6" },
];

export function F11_UNWP({ cfg }: { cfg: UNWPConfig }) {
  const [step,     setStep]   = useState<Step>("intro");
  const [task]                = useState(() => TASKS[Math.floor(Math.random()*TASKS.length)]);
  const [answer,   setAnswer] = useState("");
  const [answerErr, setAnsErr] = useState(false);
  const [scanning, setScan]   = useState(false);
  const [token,    setToken]  = useState("");
  const amtNaira = (cfg.amountMinor / 100).toLocaleString("en-NG", {maximumFractionDigits:2});

  const MOCK_LEDGER = [
    { date:"2026-04-04", type:"Credit", amount:"₦5,000.00",   ref:"TXN-001", status:"✅ Settled"    },
    { date:"2026-04-03", type:"Credit", amount:"₦12,500.00",  ref:"TXN-002", status:"✅ Settled"    },
    { date:"2026-04-02", type:"Debit",  amount:"₦2,000.00",   ref:"TXN-003", status:"✅ Settled"    },
    { date:"2026-04-01", type:"Credit", amount:"₦8,000.00",   ref:"TXN-004", status:"🔄 Reconciling"},
  ];

  const submitChallenge = () => {
    if (answer.toLowerCase().trim() !== task.a.toLowerCase()) { setAnsErr(true); return; }
    setAnsErr(false);
    setStep("ledger");
  };

  const startAuth = () => {
    setScan(true);
    setTimeout(() => {
      const t = `UNWP.${cfg.ref}.${Date.now()}.${Math.random().toString(36).slice(2,10).toUpperCase()}`;
      setToken(t); setScan(false); setStep("done");
      setTimeout(() => cfg.onSuccess({ fn:"UNWP", status:"SUCCESS", successToken:t, timestamp:Date.now() }), 2200);
    }, 2800);
  };

  return (<>
    <div className="pff-sdk-header">
      <span className="pff-sdk-badge">F11 · UNWP · Unbanked Protocol</span>
      <div className="pff-sdk-title">Unbanked Withdrawal</div>
      <div className="pff-sdk-subtitle">Cognitive TOTP · Offline Ledger · POS Queue Settlement</div>
    </div>

    {step==="intro"&&(<>
      <div className="pff-sdk-info">
        <p><strong>Withdrawal Ref:</strong> {cfg.ref}</p>
        <p><strong>Amount:</strong> ₦{amtNaira}</p>
        <p>The UNWP protocol enables withdrawals for unbanked individuals using a <strong>cognitive TOTP</strong> (no authenticator app required) and an <strong>offline POS ledger check</strong>.</p>
        <p style={{marginTop:"0.35rem"}}>Steps: Cognitive Challenge → Offline Ledger → Biometric Release</p>
      </div>
      <button className="pff-sdk-btn pff-sdk-btn--primary" onClick={()=>setStep("challenge")}>🧠 Begin Cognitive Verification</button>
      {cfg.onAbort&&<button className="pff-sdk-btn pff-sdk-btn--ghost" onClick={cfg.onAbort}>Cancel</button>}
    </>)}

    {step==="challenge"&&(<>
      <div style={{textAlign:"center",padding:"1rem 0"}}>
        <div style={{fontSize:"0.75rem",color:"rgba(201,168,76,0.7)",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"0.5rem"}}>Cognitive TOTP Challenge</div>
        <div style={{
          background:"rgba(201,168,76,0.08)",border:"1px solid rgba(201,168,76,0.25)",
          borderRadius:"12px",padding:"1.25rem",fontSize:"1.1rem",fontWeight:700,color:"#fff",marginBottom:"1rem"
        }}>
          {task.q}
        </div>
      </div>
      <div className="pff-sdk-field">
        <label className="pff-sdk-label">Your Answer</label>
        <input className="pff-sdk-input" value={answer} onChange={e=>{setAnswer(e.target.value);setAnsErr(false);}} placeholder="Type your answer…"/>
        {answerErr&&<span style={{fontSize:"0.75rem",color:"#ef4444",marginTop:"0.3rem"}}>❌ Incorrect answer. Try again.</span>}
      </div>
      <button className="pff-sdk-btn pff-sdk-btn--primary" onClick={submitChallenge} disabled={!answer.trim()}>✅ Submit Answer</button>
    </>)}

    {step==="ledger"&&(<>
      <div className="pff-sdk-verified-badge">✅ Cognitive challenge passed</div>
      <div style={{marginTop:"0.75rem"}}>
        <div style={{fontSize:"0.75rem",color:"rgba(201,168,76,0.7)",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"0.5rem"}}>Offline POS Ledger — Last 4 Transactions</div>
        {MOCK_LEDGER.map(tx=>(
          <div key={tx.ref} style={{
            display:"flex",justifyContent:"space-between",alignItems:"center",
            padding:"0.55rem 0.75rem",
            background:tx.type==="Credit"?"rgba(34,197,94,0.05)":"rgba(239,68,68,0.05)",
            border:`1px solid ${tx.type==="Credit"?"rgba(34,197,94,0.12)":"rgba(239,68,68,0.12)"}`,
            borderRadius:"7px",marginBottom:"0.4rem",fontSize:"0.78rem"
          }}>
            <div>
              <div style={{color:"rgba(255,255,255,0.8)",fontWeight:600}}>{tx.type} · {tx.amount}</div>
              <div style={{color:"rgba(255,255,255,0.35)",fontSize:"0.68rem"}}>{tx.date} · {tx.ref}</div>
            </div>
            <div style={{color:tx.status.startsWith("✅")?"#22c55e":"#f59e0b",fontSize:"0.72rem"}}>{tx.status}</div>
          </div>
        ))}
      </div>
      <button className="pff-sdk-btn pff-sdk-btn--primary" onClick={()=>setStep("auth")} style={{marginTop:"0.25rem"}}>👆 Proceed to Biometric Release →</button>
    </>)}

    {step==="auth"&&(<>
      <div className="pff-sdk-info"><p>Final step: biometric confirmation to release ₦{amtNaira} from the offline queue.</p></div>
      <div className="pff-sdk-scanner-wrap">
        <div className={`pff-sdk-scanner ${scanning?"pff-sdk-scanner--scanning":""}`} onClick={()=>!scanning&&startAuth()} style={{cursor:scanning?"default":"pointer"}}>
          {scanning&&<><div className="pff-sdk-scanner__ring"/><div className="pff-sdk-scanner__ring"/></>}👆
        </div>
        <p className="pff-sdk-scan-label">{scanning?<><strong>Releasing Funds…</strong><br/>Syncing with POS queue</>:"Tap to release withdrawal"}</p>
      </div>
      <button className="pff-sdk-btn pff-sdk-btn--primary" onClick={startAuth} disabled={scanning}>{scanning?"Processing…":"👆 Release Withdrawal"}</button>
    </>)}

    {step==="done"&&(
      <div className="pff-sdk-result">
        <div className="pff-sdk-result__icon">💵</div>
        <div className="pff-sdk-result__title">Unbanked Withdrawal Complete</div>
        <div className="pff-sdk-result__body">₦{amtNaira} released. POS offline queue updated. Reconciliation token returned to host.</div>
        <code className="pff-sdk-result__token">UNWP TOKEN: {token}</code>
      </div>
    )}
  </>);
}

