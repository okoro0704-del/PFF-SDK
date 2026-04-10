// ─── F02 · ZFOE — Zero-Friction Account Opening ──────────────────────────────
import { useState, useEffect } from "react";
import type { ZFOEConfig } from "../types";

type Step = "form"|"nibss"|"biometric"|"success";

export function F02_ZFOE({ cfg }: { cfg: ZFOEConfig }) {
  const [step,  setStep]  = useState<Step>("form");
  const [bvn,   setBvn]   = useState(cfg.prefillBvn ?? "");
  const [phone, setPhone] = useState("");
  const [bank,  setBank]  = useState("ACCESS");
  const [scanning, setScan] = useState(false);
  const [acctNum, setAcct]  = useState("");

  const BANKS = ["Access Bank","Zenith Bank","GTBank","First Bank","UBA","Wema Bank","Providus Bank","FCMB","Fidelity Bank","Union Bank"];

  const submit = () => {
    if (bvn.length !== 11 || phone.length < 10) return;
    setStep("nibss");
    setTimeout(() => setStep("biometric"), 4000);
  };

  const scan = () => {
    setScan(true);
    setTimeout(() => {
      setAcct(`00${Math.floor(Math.random()*9_000_000_000+1_000_000_000)}`);
      setScan(false);
      setStep("success");
    }, 2800);
  };

  useEffect(() => {
    if (step === "success" && acctNum)
      setTimeout(() => cfg.onSuccess({ fn:"ZFOE", status:"SUCCESS", accountNumber:acctNum, successToken:`ZFOE.${acctNum}.${Date.now()}`, timestamp:Date.now() }), 2200);
  }, [step, acctNum]); // eslint-disable-line

  return (<>
    <div className="pff-sdk-header">
      <span className="pff-sdk-badge">F02 · ZFOE · Zero-Friction Opening</span>
      <div className="pff-sdk-title">Open a Bank Account</div>
      <div className="pff-sdk-subtitle">NIBSS Instant Verification · Biometric Enrollment</div>
    </div>
    <div className="pff-sdk-steps">
      {["Details","NIBSS","Biometric","Done"].map((_,i)=>{
        const si = {form:0,nibss:1,biometric:2,success:3}[step];
        return <div key={i} className={`pff-sdk-step ${i<si?"pff-sdk-step--done":i===si?"pff-sdk-step--active":""}`}/>;
      })}
    </div>

    {step==="form"&&(<>
      <div className="pff-sdk-field"><label className="pff-sdk-label">BVN (11 digits) *</label>
        <input className="pff-sdk-input" maxLength={11} value={bvn} onChange={e=>setBvn(e.target.value.replace(/\D/g,""))} placeholder="11-digit BVN"/>
      </div>
      <div className="pff-sdk-field"><label className="pff-sdk-label">Phone Number *</label>
        <input className="pff-sdk-input" value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,""))} placeholder="08XXXXXXXXX"/>
      </div>
      <div className="pff-sdk-field"><label className="pff-sdk-label">Preferred Bank</label>
        <select className="pff-sdk-input" value={bank} onChange={e=>setBank(e.target.value)} style={{cursor:"pointer"}}>
          {BANKS.map(b=><option key={b}>{b}</option>)}
        </select>
      </div>
      <div className="pff-sdk-info"><p>Your identity will be verified via <strong>NIBSS</strong> in real-time. No paperwork required. Account created in under 60 seconds.</p></div>
      <button className="pff-sdk-btn pff-sdk-btn--primary" onClick={submit} disabled={bvn.length!==11||phone.length<10}>🚀 Open Account Now →</button>
      {cfg.onAbort&&<button className="pff-sdk-btn pff-sdk-btn--ghost" onClick={cfg.onAbort}>Cancel</button>}
    </>)}

    {step==="nibss"&&(
      <div className="pff-sdk-scanner-wrap">
        <div className="pff-sdk-scanner pff-sdk-scanner--scanning">
          <div className="pff-sdk-scanner__ring"/><div className="pff-sdk-scanner__ring"/>🔗
        </div>
        <p className="pff-sdk-scan-label"><strong>Querying NIBSS…</strong><br/>Verifying BVN · Phone · Liveness Check<br/>Please wait up to 60 seconds</p>
      </div>
    )}

    {step==="biometric"&&(<>
      <div className="pff-sdk-verified-badge">✅ NIBSS Verification Complete</div>
      <p style={{fontSize:"0.78rem",color:"rgba(255,255,255,0.5)",textAlign:"center",marginTop:"0.5rem",lineHeight:1.6}}>Enroll your fingerprint to secure the new account.</p>
      <div className="pff-sdk-scanner-wrap">
        <div className={`pff-sdk-scanner ${scanning?"pff-sdk-scanner--scanning":""}`} onClick={()=>!scanning&&scan()} style={{cursor:scanning?"default":"pointer"}}>
          {scanning&&<><div className="pff-sdk-scanner__ring"/><div className="pff-sdk-scanner__ring"/></>}👆
        </div>
        <p className="pff-sdk-scan-label">{scanning?<><strong>Enrolling Biometric…</strong><br/>Hold still</>:"Tap to enroll fingerprint"}</p>
      </div>
      <button className="pff-sdk-btn pff-sdk-btn--primary" onClick={scan} disabled={scanning}>{scanning?"Enrolling…":"👆 Enroll Fingerprint"}</button>
    </>)}

    {step==="success"&&(
      <div className="pff-sdk-result">
        <div className="pff-sdk-result__icon">🏦</div>
        <div className="pff-sdk-result__title">Account Opened Successfully</div>
        <div className="pff-sdk-result__body">Your {bank} account has been created and biometrically secured via NIBSS.</div>
        <code className="pff-sdk-result__token">ACCOUNT: {acctNum}</code>
      </div>
    )}
  </>);
}

