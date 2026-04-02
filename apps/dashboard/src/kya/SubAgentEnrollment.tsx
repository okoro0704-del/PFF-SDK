// ─── PFF-TRUST · KYA — Sub-Agent Enrollment Wizard ───────────────────────────
// 5-Step Chain of Trust: Identity → Blacklist → OTP → Bond → Done

import { useState, useEffect } from "react";
import type { MasterProfile, SubAgent, EnrollStep } from "./types";

const BLACKLIST_CHECKS = [
  "F-Man Global Blacklist",
  "NIBSS Fraud Intelligence Registry",
  "CBN Agent Watch-List",
  "Inter-Bank Sanctions Database",
  "F-Man BSSS Compliance Check",
];

interface Props {
  masterProfile: MasterProfile;
  onComplete:    (a: SubAgent) => void;
  onCancel:      () => void;
}

export function SubAgentEnrollment({ masterProfile, onComplete, onCancel }: Props) {
  const [step,     setStep]    = useState<EnrollStep>("input");
  const [bvn,      setBvn]     = useState("");
  const [phone,    setPhone]   = useState("");
  const [otp,      setOtp]     = useState("");
  const [checkIdx, setCheckIdx] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const [flagged,  setFlagged]  = useState(false);

  const seq       = masterProfile.subAgents.length + 1;
  const ssId      = `SS-${masterProfile.agentId}-${String(seq).padStart(4,"0")}`;
  const mockName  = `Sub-Agent ${bvn.slice(-3)}`;            // real: from NIBSS BVN lookup
  const phoneMask = phone.slice(0,4) + "***" + phone.slice(-4);
  const bvnMask   = bvn.slice(0,4)  + "***" + bvn.slice(-4);

  // ── Step 2: Tick through each blacklist check (700ms each) ────────────────
  useEffect(() => {
    if (step !== "blacklist") return;
    const t = setInterval(() => {
      setCheckIdx(p => {
        if (p >= BLACKLIST_CHECKS.length - 1) {
          clearInterval(t);
          // 5% chance of flagged result for demo realism
          const isFlagged = Math.random() < 0.05;
          setFlagged(isFlagged);
          setTimeout(() => setStep(isFlagged ? "done" : "otp"), 700);
          return p;
        }
        return p + 1;
      });
    }, 700);
    return () => clearInterval(t);
  }, [step]);

  const submitInput = () => {
    if (bvn.length !== 11 || phone.length < 11) return;
    setCheckIdx(0); setFlagged(false);
    setStep("blacklist");
  };

  const submitOtp = () => {
    if (otp.length !== 6) return;
    setStep("bond");
  };

  const submitBond = () => {
    if (!accepted) return;
    onComplete({
      ssId, bvnMasked: bvnMask, phoneMasked: phoneMask,
      displayName: mockName,
      linkedAt: Date.now(), status: "PENDING_BIO",
      bioActivated: false,
    } satisfies SubAgent);
  };

  const stepIdx = { input:0, blacklist:1, otp:2, bond:3, done:4 }[step];

  return (
    <>
      <div className="kya-header">
        <div>
          <span className="kya-badge">KYA · Sub-Link Injection</span>
          <div className="kya-title">Link New Sub-Agent</div>
          <div className="kya-subtitle">Chain of Trust · CBN-Compliant · BSSS Protocol</div>
        </div>
      </div>

      <div className="kya-steps">
        {["Identity","Blacklist","OTP","Bond","Done"].map((_,i) => (
          <div key={i} className={`kya-step ${i<stepIdx?"kya-step--done":i===stepIdx?"kya-step--active":""}`}/>
        ))}
      </div>

      {/* ── STEP 1: Identity Input ── */}
      {step === "input" && (<>
        <div className="kya-field">
          <label className="kya-label">Sub-Agent BVN (11 digits)</label>
          <input className="kya-input" maxLength={11} value={bvn}
            onChange={e => setBvn(e.target.value.replace(/\D/g,""))}
            placeholder="Enter Sub-Agent BVN" />
        </div>
        <div className="kya-field">
          <label className="kya-label">BVN-Linked Phone Number</label>
          <input className="kya-input" maxLength={14} value={phone}
            onChange={e => setPhone(e.target.value.replace(/\D/g,""))}
            placeholder="080XXXXXXXX — for OTP challenge" />
        </div>
        <div className="kya-info">
          <p><strong>Note:</strong> The Sub-Agent must be physically present and consent to this linkage. Their identity will be verified against the <strong>F-Man Global Blacklist</strong> and <strong>NIBSS Fraud Registry</strong> before any bond is issued.</p>
        </div>
        <button className="kya-btn kya-btn--primary" onClick={submitInput} disabled={bvn.length!==11||phone.length<11}>
          🔍 Verify on F-Man Global Blacklist →
        </button>
        <button className="kya-btn kya-btn--ghost" onClick={onCancel}>Cancel</button>
      </>)}

      {/* ── STEP 2: F-Man Global Blacklist Check ── */}
      {step === "blacklist" && (
        <div className="kya-check-wrap">
          <div className="kya-check-icon">🛡️</div>
          <div style={{fontSize:"0.82rem",color:"rgba(255,255,255,0.55)",textAlign:"center"}}>
            <strong style={{color:"#c9a84c"}}>Querying F-Man Global Blacklist…</strong><br/>
            Checking {BLACKLIST_CHECKS.length} registries before bond is issued
          </div>
          <div className="kya-check-rows" style={{width:"100%"}}>
            {BLACKLIST_CHECKS.map((label, i) => (
              <div key={label} className="kya-check-row">
                <span className={`kya-check-dot ${i < checkIdx ? "kya-check-dot--ok" : i === checkIdx ? "kya-check-dot--run" : "kya-check-dot--wait"}`}/>
                {label}
                {i < checkIdx && <span style={{marginLeft:"auto",fontSize:"0.7rem",color:"#22c55e"}}>✓ CLEAR</span>}
                {i === checkIdx && <span style={{marginLeft:"auto",fontSize:"0.7rem",color:"#c9a84c"}}>Checking…</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── STEP 3: Secondary OTP Challenge ── */}
      {step === "otp" && (<>
        <div className="kya-info">
          <p>A one-time passcode has been sent to the Sub-Agent's registered number: <strong>{phoneMask}</strong></p>
          <p>The Sub-Agent must verbally confirm this code to you. Enter it below to proceed.</p>
        </div>
        <div className="kya-field">
          <label className="kya-label">6-Digit OTP (from Sub-Agent's phone)</label>
          <input className="kya-input" maxLength={6} value={otp}
            onChange={e => setOtp(e.target.value.replace(/\D/g,""))}
            placeholder="Enter 6-digit OTP" style={{letterSpacing:"0.25em",fontSize:"1.1rem",textAlign:"center"}}/>
        </div>
        <button className="kya-btn kya-btn--primary" onClick={submitOtp} disabled={otp.length!==6}>
          ✅ Confirm OTP &amp; Proceed to Bond
        </button>
        <button className="kya-btn kya-btn--ghost" onClick={() => setStep("input")}>← Back</button>
      </>)}

      {/* ── STEP 4: Sub-Sovereign Bond + Master Liability Disclaimer ── */}
      {step === "bond" && (<>
        {/* Chain of Trust visual */}
        <div className="kya-chain">
          <div className="kya-chain__node">🏆 {masterProfile.displayName} <span style={{fontSize:"0.6rem",color:"#c9a84c",marginLeft:"0.5rem"}}>MASTER AGENT · {masterProfile.agentId}</span></div>
          <div className="kya-chain__line"/>
          <div className="kya-chain__node" style={{borderColor:"rgba(34,197,94,0.3)",background:"rgba(34,197,94,0.05)"}}>
            🤝 {mockName} <span style={{fontSize:"0.6rem",color:"#22c55e",marginLeft:"0.5rem"}}>{ssId}</span>
          </div>
        </div>

        {/* Sub-Sovereign Bond Certificate */}
        <div className="kya-bond">
          <div className="kya-bond__seal">🔗</div>
          <div className="kya-bond__ssid">{ssId}</div>
          <div className="kya-bond__name">Sub-Sovereign ID — {mockName}</div>
          <div className="kya-bond__date">Issued: {new Date().toUTCString()}</div>
        </div>

        {/* CBN Liability Disclaimer */}
        <div className="kya-disclaimer">
          <div className="kya-disclaimer__title">⚖️ Master Agent Liability Declaration</div>
          <div className="kya-disclaimer__body">
            As the <strong>Master Agent ({masterProfile.displayName} · {masterProfile.agentId})</strong>, you are
            <strong> legally responsible</strong> for all transactions, BSSS compliance, and conduct of this
            linked Sub-Agent <strong>({ssId})</strong> under{" "}
            <strong>CBN Agent Banking Policy 2024</strong> and the <strong>F-Man Network Agreement</strong>.
            Fraudulent activity by a Sub-Agent may result in your terminal suspension and prosecution.
          </div>
        </div>

        <label style={{display:"flex",alignItems:"flex-start",gap:"0.6rem",cursor:"pointer",fontSize:"0.78rem",color:"rgba(255,255,255,0.55)",margin:"0.5rem 0 1rem",lineHeight:1.6}}>
          <input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)}
            style={{marginTop:"0.2rem",accentColor:"#c9a84c",flexShrink:0}}/>
          I have read and accept full legal liability for this Sub-Agent under CBN Policy and the F-Man Network Agreement.
        </label>

        <button className="kya-btn kya-btn--primary" onClick={submitBond} disabled={!accepted}>
          🔗 Issue Sub-Sovereign Bond &amp; Activate Link
        </button>
        <button className="kya-btn kya-btn--ghost" onClick={() => setStep("otp")}>← Back</button>
      </>)}

      {/* ── STEP 5: Done (or Blacklisted) ── */}
      {step === "done" && (
        flagged ? (
          <div className="kya-result">
            <div className="kya-result__icon">🚫</div>
            <div className="kya-result__title">Sub-Agent Flagged — Bond Denied</div>
            <div className="kya-result__body">
              This BVN (<strong style={{color:"#c9a84c"}}>{bvnMask}</strong>) has been found on the{" "}
              <strong style={{color:"#ef4444"}}>F-Man Global Blacklist</strong>. A Sub-Sovereign Bond cannot be issued.
              Report this attempt to the F-Man Compliance Team.
            </div>
            <button className="kya-btn kya-btn--danger" onClick={onCancel} style={{marginTop:"1.2rem"}}>Close</button>
          </div>
        ) : (
          <div className="kya-result">
            <div className="kya-result__icon">✅</div>
            <div className="kya-result__title">Sub-Agent Linked — Bond Active</div>
            <div className="kya-result__body">
              <strong style={{color:"#c9a84c"}}>{ssId}</strong> is now active under your umbrella.
              Their biometric signature (BAS) must be registered on this terminal to enable transactions.
              Status: <strong style={{color:"#c9a84c"}}>PENDING_BIO</strong>
            </div>
            <div className="kya-result__token">SUB-SOVEREIGN ID: {ssId} · MASTER: {masterProfile.agentId}</div>
          </div>
        )
      )}
    </>
  );
}

