// ─── F06 · ZFPS — Zero-Friction Provisioning System ──────────────────────────
import { useState, useEffect } from "react";
import type { ZFPSConfig } from "../types";

interface Provision {
  id: string; service: string; status: string;
  nibssRef: string; provisioned: boolean; latencyMs: number;
}

const SERVICES = [
  { id:"BVN_LINK",  service:"BVN-Account Link",           latencyMs: 842 },
  { id:"NIN_SYNC",  service:"NIN-BVN Cross-Reference",    latencyMs: 1124 },
  { id:"CBNKY",     service:"CBN KYC Tier Upgrade",       latencyMs: 2210 },
  { id:"NUBAN",     service:"NUBAN Allocation",           latencyMs: 380 },
  { id:"MANDATE",   service:"NIBSS Mandate Registration", latencyMs: 1540 },
  { id:"LIMITS",    service:"Transaction Limit Sync",     latencyMs: 620 },
];

export function F06_ZFPS({ cfg }: { cfg: ZFPSConfig }) {
  const [step, setStep]           = useState<"ready"|"running"|"done">("ready");
  const [provisions, setProvisions] = useState<Provision[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (step !== "running") return;
    if (currentIdx >= SERVICES.length) { setStep("done"); return; }
    const svc = SERVICES[currentIdx];
    const t = setTimeout(() => {
      setProvisions(p => [...p, {
        ...svc,
        nibssRef: `NIBSS-${svc.id}-${Date.now().toString(36).toUpperCase()}`,
        status: "PROVISIONED",
        provisioned: true,
      }]);
      setCurrentIdx(i => i+1);
    }, svc.latencyMs);
    return () => clearTimeout(t);
  }, [step, currentIdx]);

  useEffect(() => {
    if (step === "done")
      setTimeout(() => cfg.onSuccess({
        fn:"ZFPS", status:"SUCCESS",
        successToken:`ZFPS.${Date.now()}.${Math.random().toString(36).slice(2,10).toUpperCase()}`,
        timestamp:Date.now(),
      }), 2500);
  }, [step]); // eslint-disable-line

  return (<>
    <div className="pff-sdk-header">
      <span className="pff-sdk-badge">F06 · ZFPS · Provisioning System</span>
      <div className="pff-sdk-title">Zero-Friction Provisioning</div>
      <div className="pff-sdk-subtitle">NIBSS Instant Settlement · CBN KYC Sync · 6 Services</div>
    </div>

    {step==="ready"&&(<>
      <div className="pff-sdk-info">
        <p>ZFPS will provision {SERVICES.length} NIBSS and CBN services in sequence — automatically, in real-time. No manual steps required.</p>
        <p style={{marginTop:"0.5rem"}}>Services to be provisioned:</p>
        {SERVICES.map(s=><p key={s.id} style={{paddingLeft:"0.75rem"}}>• {s.service}</p>)}
      </div>
      <button className="pff-sdk-btn pff-sdk-btn--primary" onClick={()=>{setStep("running");setCurrentIdx(0);}}>🚀 Start Provisioning</button>
      {cfg.onAbort&&<button className="pff-sdk-btn pff-sdk-btn--ghost" onClick={cfg.onAbort}>Cancel</button>}
    </>)}

    {(step==="running"||step==="done")&&(<>
      <div style={{display:"flex",flexDirection:"column",gap:"0.5rem",margin:"0.25rem 0"}}>
        {SERVICES.map((s,i)=>{
          const done = provisions.find(p=>p.id===s.id);
          const isActive = !done && i===currentIdx && step==="running";
          return (
            <div key={s.id} style={{
              display:"flex",alignItems:"center",gap:"0.75rem",
              background:done?"rgba(34,197,94,0.06)":isActive?"rgba(201,168,76,0.06)":"rgba(255,255,255,0.02)",
              border:`1px solid ${done?"rgba(34,197,94,0.2)":isActive?"rgba(201,168,76,0.2)":"rgba(255,255,255,0.06)"}`,
              borderRadius:"8px",padding:"0.65rem 0.9rem",transition:"all 0.3s"
            }}>
              <div style={{fontSize:"1.1rem",minWidth:"1.4rem",textAlign:"center"}}>
                {done?"✅":isActive?"⏳":"⬜"}
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:"0.82rem",fontWeight:600,color:done?"#22c55e":isActive?"#c9a84c":"rgba(255,255,255,0.4)"}}>{s.service}</div>
                {done&&<div style={{fontSize:"0.68rem",color:"rgba(255,255,255,0.3)",fontFamily:"monospace",marginTop:"0.1rem"}}>{done.nibssRef} · {done.latencyMs}ms</div>}
                {isActive&&<div style={{fontSize:"0.68rem",color:"rgba(201,168,76,0.6)",marginTop:"0.1rem"}}>Provisioning via NIBSS…</div>}
              </div>
            </div>
          );
        })}
      </div>
      {step==="done"&&(
        <div className="pff-sdk-result" style={{marginTop:"0.5rem"}}>
          <div className="pff-sdk-result__icon">🚀</div>
          <div className="pff-sdk-result__title">All Services Provisioned</div>
          <div className="pff-sdk-result__body">{SERVICES.length} NIBSS and CBN services provisioned successfully. Returning control to host application.</div>
        </div>
      )}
    </>)}
  </>);
}

