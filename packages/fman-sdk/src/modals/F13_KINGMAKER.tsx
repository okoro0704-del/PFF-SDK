// ─── F13 · KINGMAKER — Sovereign Vault Partner Application ───────────────────
import { useState } from "react";
import type { KINGMAKERConfig } from "../types";
import { getApiUrl } from "../config";

const API = getApiUrl();
type Stage = "form"|"submitting"|"success"|"error"|"idle";
void (("idle") as Stage);

export function F13_KINGMAKER({ cfg }: { cfg: KINGMAKERConfig }) {
  const [stage,  setStage]  = useState<Stage>("form");
  const isSubmitting = stage === "submitting";
  const [ref,    setRef]    = useState("");
  const [errMsg, setErrMsg] = useState<string|null>(null);
  const [form, setForm] = useState({
    bankCode:"", bankName:"", apiEndpoint:"https://", contactEmail:"", contactName:"", cbnLicenceRef:""
  });
  const set = (k: keyof typeof form, v: string) => setForm(p=>({...p,[k]:v}));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStage("submitting"); setErrMsg(null);
    try {
      const r = await fetch(`${API}/v1/kingmaker/partners/apply`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({...form, orgId:"default"}),
      });
      const d = await r.json();
      if (r.ok) { setRef(d.partnerRef ?? ""); setStage("success"); }
      else { setErrMsg(d.message ?? "Submission failed"); setStage("error" as Stage); }
    } catch { setErrMsg("Network error — check connection"); setStage("error"); }
  };

  const inp: React.CSSProperties = {
    background:"rgba(255,255,255,0.04)", border:"1px solid rgba(201,168,76,0.2)",
    borderRadius:"8px", color:"#fff", fontSize:"0.88rem", padding:"0.6rem 0.85rem",
    width:"100%", boxSizing:"border-box", outline:"none", fontFamily:"inherit",
  };

  if (stage === "success") return (<>
    <div className="pff-sdk-result">
      <div className="pff-sdk-result__icon">♛</div>
      <div className="pff-sdk-result__title" style={{color:"#c9a84c"}}>Application Received</div>
      <div className="pff-sdk-result__body">{form.bankName} has been submitted for Sovereign Vault Partner review. PFF Admin will respond within 48 hours to {form.contactEmail}.</div>
      {ref&&<code className="pff-sdk-result__token">PARTNER REF: {ref}</code>}
    </div>
    <button className="pff-sdk-btn pff-sdk-btn--primary" onClick={()=>cfg.onSuccess({fn:"KINGMAKER",status:"SUCCESS",partnerRef:ref,timestamp:Date.now()})} style={{marginTop:"0.75rem"}}>
      ✅ Done
    </button>
  </>);

  return (<>
    <div className="pff-sdk-header">
      <span className="pff-sdk-badge">F13 · KINGMAKER · Sovereign Vault</span>
      <div className="pff-sdk-title">Join the Table</div>
      <div className="pff-sdk-subtitle">Apply to become a Sovereign Vault Partner</div>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.6rem",margin:"0.25rem 0"}}>
      {[
        {icon:"🔒",t:"Locked Deposits",d:"31-day sovereign AJO inflow"},
        {icon:"📶",t:"LMR Rating",     d:"Public performance score"},
        {icon:"♛",t:"Sovereign License",d:"CBN-recognised API key"},
        {icon:"🤝",t:"SDK Listing",    d:"Listed in ZFOE/SSA modals"},
      ].map(c=>(
        <div key={c.t} style={{background:"rgba(201,168,76,0.05)",border:"1px solid rgba(201,168,76,0.15)",borderRadius:"9px",padding:"0.75rem",textAlign:"center"}}>
          <div style={{fontSize:"1.3rem",marginBottom:"0.2rem"}}>{c.icon}</div>
          <div style={{fontSize:"0.78rem",fontWeight:700,color:"#fff",marginBottom:"0.15rem"}}>{c.t}</div>
          <div style={{fontSize:"0.68rem",color:"rgba(255,255,255,0.35)"}}>{c.d}</div>
        </div>
      ))}
    </div>

    {(stage==="form"||stage==="error")&&(<>
      {stage==="error"&&errMsg&&(
        <div style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.25)",borderRadius:"8px",padding:"0.6rem 0.85rem",color:"#ef4444",fontSize:"0.8rem"}}>⚠ {errMsg}</div>
      )}
      <form onSubmit={submit} style={{display:"flex",flexDirection:"column",gap:"0.8rem"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem"}}>
          <div>
            <label className="pff-sdk-label">Bank Name *</label>
            <input style={inp} required value={form.bankName} onChange={e=>set("bankName",e.target.value)} placeholder="Zenith Bank Plc"/>
          </div>
          <div>
            <label className="pff-sdk-label">CBN Sort Code *</label>
            <input style={inp} required value={form.bankCode} onChange={e=>set("bankCode",e.target.value)} placeholder="057" maxLength={6}/>
          </div>
        </div>
        <div>
          <label className="pff-sdk-label">Sovereign API Endpoint *</label>
          <input style={inp} required type="url" value={form.apiEndpoint} onChange={e=>set("apiEndpoint",e.target.value)} placeholder="https://api.bank.ng/pff-sovereign"/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem"}}>
          <div>
            <label className="pff-sdk-label">Contact Name *</label>
            <input style={inp} required value={form.contactName} onChange={e=>set("contactName",e.target.value)} placeholder="API Owner"/>
          </div>
          <div>
            <label className="pff-sdk-label">Contact Email *</label>
            <input style={inp} required type="email" value={form.contactEmail} onChange={e=>set("contactEmail",e.target.value)} placeholder="api@bank.ng"/>
          </div>
        </div>
        <div>
          <label className="pff-sdk-label">CBN Agent Banking Licence *</label>
          <input style={inp} required value={form.cbnLicenceRef} onChange={e=>set("cbnLicenceRef",e.target.value)} placeholder="CBN/ABL/2024/001" minLength={6}/>
        </div>
        <div className="pff-sdk-info" style={{fontSize:"0.72rem"}}>
          <p>⚖️ By submitting, you accept the 31-day SOVEREIGN_RESTRICTED lock protocol, BSSS compliance, and CBN Agent Banking regulations.</p>
        </div>
        <button className="pff-sdk-btn pff-sdk-btn--primary" type="submit" disabled={isSubmitting}>
          {isSubmitting?"Submitting…":"♛ Apply for Sovereign Partnership"}
        </button>
        {cfg.onAbort&&<button className="pff-sdk-btn pff-sdk-btn--ghost" type="button" onClick={cfg.onAbort}>Cancel</button>}
      </form>
    </>)}
  </>);
}

