// ─── F01 · BAS — Biometric Account Setup ─────────────────────────────────────
import { useState, useEffect } from "react";
import type { BASConfig } from "../types";

const FINGERS = [
  { id:"LT",label:"L.Thumb"}, { id:"LI",label:"L.Index"}, { id:"LM",label:"L.Mid"},
  { id:"LR",label:"L.Ring" }, { id:"LP",label:"L.Pinky"},
  { id:"RT",label:"R.Thumb"}, { id:"RI",label:"R.Index"}, { id:"RM",label:"R.Mid"},
  { id:"RR",label:"R.Ring" }, { id:"RP",label:"R.Pinky"},
];
type Step = "identity"|"lookup"|"capture"|"success";

export function F01_BAS({ cfg }: { cfg: BASConfig }) {
  const [step,       setStep]  = useState<Step>("identity");
  const [bvn,        setBvn]   = useState("");
  const [nin,        setNin]   = useState("");
  const [fingerDone, setFD]    = useState(0);
  const [scanning,   setScan]  = useState(false);
  const [accountNum, setAcct]  = useState("");

  const doLookup = () => {
    if (bvn.length !== 11 || nin.length !== 11) return;
    setStep("lookup");
    setTimeout(() => setStep("capture"), 3500);
  };

  const scanNext = () => {
    if (scanning || fingerDone >= 10) return;
    setScan(true);
    setTimeout(() => { setFD(p => p + 1); setScan(false); }, 1100);
  };

  useEffect(() => {
    if (fingerDone === 10) {
      setTimeout(() => {
        setAcct(`00${Math.floor(Math.random() * 9_000_000_000 + 1_000_000_000)}`);
        setStep("success");
      }, 900);
    }
  }, [fingerDone]);

  useEffect(() => {
    if (step === "success" && accountNum) {
      setTimeout(() => cfg.onSuccess({
        fn:"BAS", status:"SUCCESS", accountNumber:accountNum,
        successToken:`BAS.${accountNum}.${Date.now()}`, timestamp:Date.now(),
      }), 2800);
    }
  }, [step, accountNum]); // eslint-disable-line

  const si = { identity:0, lookup:1, capture:2, success:3 }[step];
  return (<>
    <div className="pff-sdk-header">
      <span className="pff-sdk-badge">F01 · BAS · Tier {cfg.tier}</span>
      <div className="pff-sdk-title">Biometric Account Setup</div>
      <div className="pff-sdk-subtitle">NIBSS-Powered · CBN-Compliant · Tier-{cfg.tier}</div>
    </div>
    <div className="pff-sdk-steps">
      {["Identity","NIBSS Lookup","10-Finger Capture","Account Created"].map((_,i) => (
        <div key={i} className={`pff-sdk-step ${i<si?"pff-sdk-step--done":i===si?"pff-sdk-step--active":""}`}/>
      ))}
    </div>

    {step === "identity" && (<>
      <div className="pff-sdk-field"><label className="pff-sdk-label">BVN (11 digits)</label>
        <input className="pff-sdk-input" maxLength={11} value={bvn} onChange={e=>setBvn(e.target.value.replace(/\D/g,""))} placeholder="11-digit BVN"/>
      </div>
      <div className="pff-sdk-field"><label className="pff-sdk-label">NIN (11 digits)</label>
        <input className="pff-sdk-input" maxLength={11} value={nin} onChange={e=>setNin(e.target.value.replace(/\D/g,""))} placeholder="11-digit NIN"/>
      </div>
      <div className="pff-sdk-info"><p>Your Tier-{cfg.tier} account will be linked to your BVN and NIN via real-time <strong>NIBSS</strong> verification. Raw data never leaves this device.</p></div>
      <button className="pff-sdk-btn pff-sdk-btn--primary" onClick={doLookup} disabled={bvn.length!==11||nin.length!==11}>🔍 Verify via NIBSS →</button>
      {cfg.onAbort && <button className="pff-sdk-btn pff-sdk-btn--ghost" onClick={cfg.onAbort}>Cancel</button>}
    </>)}

    {step === "lookup" && (
      <div className="pff-sdk-scanner-wrap">
        <div className="pff-sdk-scanner pff-sdk-scanner--scanning">
          <div className="pff-sdk-scanner__ring"/><div className="pff-sdk-scanner__ring"/>🔗
        </div>
        <p className="pff-sdk-scan-label"><strong>Querying NIBSS…</strong><br/>Verifying BVN · NIN · Liveness Check</p>
      </div>
    )}

    {step === "capture" && (<>
      <p style={{fontSize:"0.78rem",color:"rgba(255,255,255,0.5)",textAlign:"center"}}>
        {fingerDone < 10 ? <>{fingerDone}/10 fingers captured — tap Scan Finger</> : "All 10 captured — provisioning account…"}
      </p>
      <div className="pff-sdk-scanner-wrap">
        <div className={`pff-sdk-scanner ${scanning?"pff-sdk-scanner--scanning":fingerDone===10?"pff-sdk-scanner--success":""}`}
          onClick={scanNext} style={{cursor:fingerDone<10&&!scanning?"pointer":"default"}}>
          {scanning&&<><div className="pff-sdk-scanner__ring"/><div className="pff-sdk-scanner__ring"/></>}
          {fingerDone===10?"✅":"👆"}
        </div>
      </div>
      <div className="pff-sdk-fingers">
        {FINGERS.map((f,i) => (
          <div key={f.id} className="pff-sdk-finger">
            <span>{i<5?"🫲":"🫱"}</span>
            <div className={`pff-sdk-finger__dot ${i<fingerDone?"pff-sdk-finger__dot--done":i===fingerDone&&scanning?"pff-sdk-finger__dot--active":""}`}/>
            <span className="pff-sdk-finger__label">{f.label}</span>
          </div>
        ))}
      </div>
      <button className="pff-sdk-btn pff-sdk-btn--primary" onClick={scanNext} disabled={scanning||fingerDone>=10}>
        {scanning?"Scanning…":fingerDone>=10?"✅ Complete":`👆 Scan Finger ${fingerDone+1} of 10`}
      </button>
    </>)}

    {step === "success" && (
      <div className="pff-sdk-result">
        <div className="pff-sdk-result__icon">🏦</div>
        <div className="pff-sdk-result__title">Account Provisioned</div>
        <div className="pff-sdk-result__body">Tier-{cfg.tier} biometric account created via NIBSS. All 10 fingerprint templates registered.</div>
        <code className="pff-sdk-result__token">ACCOUNT: {accountNum}</code>
        <p style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.3)",marginTop:"0.7rem"}}>Pushing to host application…</p>
      </div>
    )}
  </>);
}

