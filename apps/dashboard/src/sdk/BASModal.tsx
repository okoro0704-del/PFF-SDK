// ─── PFF-TRUST · SDK FUNCTION 1 — BAS (Biometric Account Setup) ──────────────
// Protocol: Tier-1 / Tier-3 auto account creation · NIBSS BVN/NIN lookup
// 10-finger biometric template capture · force-push account number to host DB

import { useState, useEffect } from "react";
import type { BASConfig, SDKResult } from "./types";

type Step = "identity" | "lookup" | "capture" | "success";

const FINGERS = [
  { id:"LT", label:"L.Thumb"  }, { id:"LI", label:"L.Index" },
  { id:"LM", label:"L.Mid"    }, { id:"LR", label:"L.Ring"  },
  { id:"LP", label:"L.Pinky"  },
  { id:"RT", label:"R.Thumb"  }, { id:"RI", label:"R.Index" },
  { id:"RM", label:"R.Mid"    }, { id:"RR", label:"R.Ring"  },
  { id:"RP", label:"R.Pinky"  },
];

export function BASModal({ cfg }: { cfg: BASConfig }) {
  const [step, setStep]         = useState<Step>("identity");
  const [bvn,  setBvn]          = useState("");
  const [nin,  setNin]          = useState("");
  const [fingerDone, setFD]     = useState(0);
  const [scanning,  setScan]    = useState(false);
  const [accountNum, setAcct]   = useState("");

  // ── Step 2: Simulated NIBSS real-time query (3.5 s) ──────────────────────
  const doLookup = () => {
    if (bvn.length !== 11 || nin.length !== 11) return;
    setStep("lookup");
    setTimeout(() => setStep("capture"), 3500);
  };

  // ── Step 3: Scan one finger at a time ────────────────────────────────────
  const scanNext = () => {
    if (scanning || fingerDone >= 10) return;
    setScan(true);
    setTimeout(() => { setFD(p => p + 1); setScan(false); }, 1100);
  };

  // Auto-advance when all 10 fingers captured
  useEffect(() => {
    if (fingerDone === 10) {
      setTimeout(() => {
        const acct = `00${Math.floor(Math.random() * 9_000_000_000 + 1_000_000_000)}`;
        setAcct(acct);
        setStep("success");
      }, 900);
    }
  }, [fingerDone]);

  // ── Step 4: Force-push account to host app DB ─────────────────────────────
  useEffect(() => {
    if (step === "success" && accountNum) {
      setTimeout(() => {
        cfg.onSuccess({
          fn: "BAS", status: "SUCCESS",
          accountNumber: accountNum,
          successToken: `BAS.${accountNum}.${Date.now()}`,
          timestamp: Date.now(),
        } satisfies SDKResult);
      }, 2800);
    }
  }, [step, accountNum]); // eslint-disable-line

  const stepIdx = { identity:0, lookup:1, capture:2, success:3 }[step];

  return (
    <>
      <div className="sdk-header">
        <div>
          <span className="sdk-badge">F-Man BAS · Tier {cfg.tier}</span>
          <div className="sdk-title">Biometric Account Setup</div>
          <div className="sdk-subtitle">NIBSS-Powered · CBN-Compliant Tier-{cfg.tier} Account</div>
        </div>
      </div>

      <div className="sdk-steps">
        {["Identity","NIBSS Lookup","10-Finger Capture","Account Created"].map((_,i) => (
          <div key={i} className={`sdk-step ${i<stepIdx?"sdk-step--done":i===stepIdx?"sdk-step--active":""}`} />
        ))}
      </div>

      {/* ── STEP 1: Identity ── */}
      {step === "identity" && (<>
        <div className="sdk-field">
          <label className="sdk-label">Bank Verification Number (BVN)</label>
          <input className="sdk-input" maxLength={11} value={bvn}
            onChange={e => setBvn(e.target.value.replace(/\D/g,""))} placeholder="11-digit BVN" />
        </div>
        <div className="sdk-field">
          <label className="sdk-label">National Identification Number (NIN)</label>
          <input className="sdk-input" maxLength={11} value={nin}
            onChange={e => setNin(e.target.value.replace(/\D/g,""))} placeholder="11-digit NIN" />
        </div>
        <div className="sdk-info">
          <p>Your Tier-{cfg.tier} account will be linked to your BVN and NIN via real-time <strong>NIBSS</strong> verification. Raw data never leaves this device.</p>
        </div>
        <button className="sdk-btn sdk-btn--primary" onClick={doLookup} disabled={bvn.length!==11||nin.length!==11}>
          🔍 Verify via NIBSS →
        </button>
        {cfg.onAbort && <button className="sdk-btn sdk-btn--ghost" onClick={cfg.onAbort}>Cancel</button>}
      </>)}

      {/* ── STEP 2: NIBSS Lookup ── */}
      {step === "lookup" && (
        <div className="sdk-scanner-wrap">
          <div className="sdk-scanner sdk-scanner--scanning">
            <div className="sdk-scanner__ring"/><div className="sdk-scanner__ring"/>🔗
          </div>
          <p className="sdk-scan-label"><strong>Querying NIBSS…</strong><br/>Verifying BVN · NIN · Liveness Check</p>
        </div>
      )}

      {/* ── STEP 3: 10-Finger Biometric Capture ── */}
      {step === "capture" && (<>
        <p style={{fontSize:"0.78rem",color:"rgba(255,255,255,0.5)",textAlign:"center",marginBottom:"0.75rem"}}>
          {fingerDone < 10
            ? <>Tap <strong style={{color:"#c9a84c"}}>Scan Finger</strong> for each finger. ({fingerDone}/10 captured)</>
            : "All 10 fingers captured — provisioning account…"}
        </p>

        <div className="sdk-scanner-wrap" style={{paddingTop:"0.5rem",paddingBottom:"0.5rem"}}>
          <div
            className={`sdk-scanner ${scanning?"sdk-scanner--scanning":fingerDone===10?"sdk-scanner--success":""}`}
            onClick={scanNext}
            style={{cursor:fingerDone<10&&!scanning?"pointer":"default"}}
          >
            {scanning && <><div className="sdk-scanner__ring"/><div className="sdk-scanner__ring"/></>}
            {fingerDone === 10 ? "✅" : "👆"}
          </div>
        </div>

        <div className="sdk-fingers">
          {FINGERS.map((f,i) => (
            <div key={f.id} className="sdk-finger">
              <span>{i < 5 ? "🫲" : "🫱"}</span>
              <div className={`sdk-finger__dot ${i<fingerDone?"sdk-finger__dot--done":i===fingerDone&&scanning?"sdk-finger__dot--active":""}`}/>
              <span className="sdk-finger__label">{f.label}</span>
            </div>
          ))}
        </div>

        <button className="sdk-btn sdk-btn--primary" onClick={scanNext} disabled={scanning||fingerDone>=10}>
          {scanning ? "Scanning…" : fingerDone>=10 ? "✅ Complete" : `👆 Scan Finger ${fingerDone+1} of 10`}
        </button>
      </>)}

      {/* ── STEP 4: Account Created — force-push to host DB ── */}
      {step === "success" && (
        <div className="sdk-result">
          <div className="sdk-result__icon">🏦</div>
          <div className="sdk-result__title">Account Provisioned Successfully</div>
          <div className="sdk-result__body">
            Your Tier-{cfg.tier} biometric savings account has been created via NIBSS
            and all 10 fingerprint templates registered.
          </div>
          <code className="sdk-result__token">ACCOUNT NUMBER: {accountNum}</code>
          <p style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.28)",marginTop:"0.7rem"}}>
            Pushing account details to host application database…
          </p>
        </div>
      )}
    </>
  );
}

