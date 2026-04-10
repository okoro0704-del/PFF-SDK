// ─── F12 · KYA — Know Your Agent Sub-Link Management ────────────────────────
import { useState } from "react";
import type { KYAConfig } from "../types";

interface SubAgent {
  ssId: string; displayName: string; bvnMasked: string; phoneMasked: string;
  status: "ACTIVE"|"PENDING_BIO"|"SUSPENDED"; bioActivated: boolean;
  terminalId?: string; linkedAt: number;
}

const DEMO_SUBS: SubAgent[] = [
  { ssId:"SS-001", displayName:"Chukwuemeka Eze",   bvnMasked:"3312***7804", phoneMasked:"0803***6789", status:"ACTIVE",      bioActivated:true,  terminalId:"POS-LGA-007", linkedAt:Date.now()-86400000*5 },
  { ssId:"SS-002", displayName:"Fatima Abdullahi",  bvnMasked:"4418***2293", phoneMasked:"0706***4421", status:"PENDING_BIO", bioActivated:false, linkedAt:Date.now()-86400000*2 },
];

type View = "roster"|"enroll"|"bio"|"done";
const STATUS_COLOR = { ACTIVE:"#22c55e", PENDING_BIO:"#f59e0b", SUSPENDED:"#ef4444" };

export function F12_KYA({ cfg }: { cfg: KYAConfig }) {
  const [view,      setView]   = useState<View>("roster");
  const [agents,    setAgents] = useState<SubAgent[]>(DEMO_SUBS);
  const [bvn,       setBvn]    = useState("");
  const [phone,     setPhone]  = useState("");
  const [name,      setName]   = useState("");
  const [scanning,  setScan]   = useState(false);
  const [newSsId]              = useState(() => `SS-${Math.random().toString(36).slice(2,8).toUpperCase()}`);
  const [accepted,  setAcc]    = useState(false);

  const enrollBio = () => {
    setScan(true);
    setTimeout(() => {
      const agent: SubAgent = {
        ssId: newSsId, displayName: name, bvnMasked: `${bvn.slice(0,4)}***${bvn.slice(-4)}`,
        phoneMasked: `${phone.slice(0,4)}***${phone.slice(-4)}`,
        status:"ACTIVE", bioActivated:true, terminalId:"POS-NEW", linkedAt:Date.now(),
      };
      setAgents(p=>[...p,agent]);
      setScan(false); setView("done");
      setTimeout(() => cfg.onSuccess({ fn:"KYA", status:"SUCCESS", agentLinked:newSsId, successToken:`KYA.${newSsId}.${Date.now()}`, timestamp:Date.now() }), 2500);
    }, 2800);
  };

  return (<>
    <div className="pff-sdk-header">
      <span className="pff-sdk-badge">F12 · KYA · Know Your Agent</span>
      <div className="pff-sdk-title">Agent Chain of Trust</div>
      <div className="pff-sdk-subtitle">Master Agent: {cfg.masterAgentId} · Sub-Agent Enrollment</div>
    </div>

    {view==="roster"&&(<>
      <div style={{display:"flex",flexDirection:"column",gap:"0.6rem"}}>
        {agents.map(a=>(
          <div key={a.ssId} style={{
            background:"rgba(255,255,255,0.03)",border:`1px solid ${STATUS_COLOR[a.status]}30`,
            borderRadius:"10px",padding:"0.85rem 1rem",display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:"0.75rem"
          }}>
            <div>
              <div style={{fontWeight:700,fontSize:"0.9rem",color:"#fff",marginBottom:"0.2rem"}}>{a.displayName}</div>
              <div style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.35)",lineHeight:1.6}}>
                BVN: {a.bvnMasked} · Tel: {a.phoneMasked}<br/>
                SS-ID: {a.ssId} · Linked: {new Date(a.linkedAt).toLocaleDateString()}<br/>
                {a.terminalId&&<>Terminal: {a.terminalId}</>}
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:"0.35rem"}}>
              <span style={{background:`${STATUS_COLOR[a.status]}20`,color:STATUS_COLOR[a.status],border:`1px solid ${STATUS_COLOR[a.status]}40`,borderRadius:"4px",padding:"0.12rem 0.5rem",fontSize:"0.65rem",fontWeight:700,letterSpacing:"0.08em"}}>{a.status}</span>
              <span style={{fontSize:"0.65rem",color:a.bioActivated?"#22c55e":"#f59e0b"}}>{a.bioActivated?"🔐 Bio Active":"⏳ Bio Pending"}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="pff-sdk-info" style={{marginTop:"0.25rem"}}>
        <p>⚖️ <strong>CBN Policy:</strong> As Master Agent, you are legally responsible for all transactions and BSSS compliance of linked Sub-Agents.</p>
      </div>
      <button className="pff-sdk-btn pff-sdk-btn--primary" onClick={()=>setView("enroll")}>➕ Link New Sub-Agent</button>
      {cfg.onAbort&&<button className="pff-sdk-btn pff-sdk-btn--ghost" onClick={cfg.onAbort}>Close</button>}
    </>)}

    {view==="enroll"&&(<>
      <div className="pff-sdk-field"><label className="pff-sdk-label">Sub-Agent Full Name *</label>
        <input className="pff-sdk-input" value={name} onChange={e=>setName(e.target.value)} placeholder="Legal full name"/>
      </div>
      <div className="pff-sdk-field"><label className="pff-sdk-label">Sub-Agent BVN (11 digits) *</label>
        <input className="pff-sdk-input" maxLength={11} value={bvn} onChange={e=>setBvn(e.target.value.replace(/\D/g,""))} placeholder="11-digit BVN"/>
      </div>
      <div className="pff-sdk-field"><label className="pff-sdk-label">Phone Number *</label>
        <input className="pff-sdk-input" value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,""))} placeholder="08XXXXXXXXX"/>
      </div>
      <div className="pff-sdk-penalty" style={{background:"rgba(201,168,76,0.05)",borderColor:"rgba(201,168,76,0.2)"}}>
        <div className="pff-sdk-penalty__title" style={{color:"#c9a84c"}}>Master Agent Declaration</div>
        <div className="pff-sdk-penalty__body" style={{color:"rgba(201,168,76,0.7)"}}>By linking this Sub-Agent you accept legal responsibility for their transactions and BSSS compliance under CBN Policy.</div>
        <label style={{display:"flex",gap:"0.5rem",alignItems:"center",marginTop:"0.75rem",cursor:"pointer",fontSize:"0.8rem",color:"rgba(255,255,255,0.7)"}}>
          <input type="checkbox" checked={accepted} onChange={e=>setAcc(e.target.checked)}/>I accept responsibility
        </label>
      </div>
      <button className="pff-sdk-btn pff-sdk-btn--primary" onClick={()=>setView("bio")} disabled={!name||bvn.length!==11||phone.length<10||!accepted}>Next — Capture Sub-Agent Biometric →</button>
      <button className="pff-sdk-btn pff-sdk-btn--ghost" onClick={()=>setView("roster")}>← Back</button>
    </>)}

    {view==="bio"&&(<>
      <p style={{fontSize:"0.79rem",color:"rgba(255,255,255,0.5)",textAlign:"center",lineHeight:1.6}}>Capture <strong style={{color:"#c9a84c"}}>{name}'s</strong> biometric to activate their Sub-Agent status.</p>
      <div className="pff-sdk-scanner-wrap">
        <div className={`pff-sdk-scanner ${scanning?"pff-sdk-scanner--scanning":""}`} onClick={()=>!scanning&&enrollBio()} style={{cursor:scanning?"default":"pointer"}}>
          {scanning&&<><div className="pff-sdk-scanner__ring"/><div className="pff-sdk-scanner__ring"/></>}👆
        </div>
        <p className="pff-sdk-scan-label">{scanning?<><strong>Enrolling Biometric…</strong><br/>Keep still</>:"Tap to capture Sub-Agent fingerprint"}</p>
      </div>
      <button className="pff-sdk-btn pff-sdk-btn--primary" onClick={enrollBio} disabled={scanning}>{scanning?"Enrolling…":"👆 Capture Biometric"}</button>
    </>)}

    {view==="done"&&(
      <div className="pff-sdk-result">
        <div className="pff-sdk-result__icon">🤝</div>
        <div className="pff-sdk-result__title">Sub-Agent Linked</div>
        <div className="pff-sdk-result__body"><strong>{name}</strong> is now an active Sub-Agent under your chain of trust. Their biometric is registered for POS terminal use.</div>
        <code className="pff-sdk-result__token">KYA SS-ID: {newSsId}</code>
      </div>
    )}
  </>);
}

