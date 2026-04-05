// ─── PFF-TRUST · Agent Settings Page ─────────────────────────────────────────
// KYA (Know Your Agent) is launched via the Unified Sovereign SDK (F12_KYA).
// Sub-agent management is force-injected as a sovereign overlay, not a page.

import { usePFFTrust } from "../unified-sdk";

interface Props { onBack: () => void; }

const DEMO_SUBS = [
  { ssId:"SS-001", name:"Chukwuemeka Eze",  status:"ACTIVE",      bio:true  },
  { ssId:"SS-002", name:"Fatima Abdullahi", status:"PENDING_BIO", bio:false },
];
const STATUS_COLOR: Record<string,string> = {
  ACTIVE:"#22c55e", PENDING_BIO:"#f59e0b", SUSPENDED:"#ef4444",
};

export function AgentSettingsPage({ onBack }: Props) {
  const { launch } = usePFFTrust();
  const openKYA = () => launch({
    fn: "KYA",
    cfg: { hostAppId:"bank-portal", masterAgentId:"MA-001",
           onSuccess: () => {}, onAbort: () => {} },
  });

  return (
    <div style={{ maxWidth:860, margin:"0 auto", padding:"2.5rem 2rem" }}>

      {/* Back */}
      <button className="btn btn--ghost btn--sm" onClick={onBack} style={{marginBottom:"2rem"}}>
        ← Back
      </button>

      {/* Page title */}
      <div style={{marginBottom:"1.5rem"}}>
        <p style={{fontSize:"0.62rem",letterSpacing:"0.18em",color:"var(--gold)",textTransform:"uppercase",marginBottom:"0.4rem"}}>
          Bank &amp; Agent Portal · Terminal Settings
        </p>
        <h1 style={{fontSize:"1.9rem",fontWeight:800,color:"var(--gold-bright)",marginBottom:"0.3rem"}}>
          ⚙️ Agent Settings
        </h1>
        <p style={{color:"var(--text-muted)",fontSize:"0.85rem"}}>
          Terminal configuration, agent hierarchy, and compliance management.
        </p>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          KYA SECTION — Launched via F12_KYA · Unified Sovereign SDK
          ════════════════════════════════════════════════════════════════════ */}

      {/* Sovereign KYA header strip */}
      <div style={{
        display:"flex", alignItems:"center", gap:"0.65rem",
        background:"rgba(201,168,76,0.08)", border:"1px solid rgba(201,168,76,0.22)",
        borderRadius:"10px", padding:"0.7rem 1.1rem", marginBottom:"1.25rem",
      }}>
        <span style={{fontSize:"1rem"}}>🔗</span>
        <span style={{fontSize:"0.7rem",fontWeight:700,letterSpacing:"0.12em",color:"#c9a84c",textTransform:"uppercase"}}>
          F12 · KYA · Know Your Agent · Sovereign Chain of Trust
        </span>
        <span style={{marginLeft:"auto",fontSize:"0.6rem",color:"rgba(201,168,76,0.45)",fontFamily:"monospace"}}>
          SOVEREIGN · SDK MANAGED
        </span>
      </div>

      {/* Master Agent Card */}
      <div style={{
        display:"flex", alignItems:"center", gap:"1rem",
        background:"rgba(201,168,76,0.05)", border:"1px solid rgba(201,168,76,0.18)",
        borderRadius:"12px", padding:"1.1rem 1.25rem", marginBottom:"1.25rem",
      }}>
        <div style={{fontSize:"2rem",background:"rgba(201,168,76,0.1)",borderRadius:"50%",width:52,height:52,display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid rgba(201,168,76,0.3)"}}>🏆</div>
        <div>
          <div style={{fontWeight:800,fontSize:"1rem",color:"#fff"}}>Emmanuel Okoro</div>
          <div style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.4)",marginTop:"0.15rem"}}>Agent ID: MA-001 · BVN: 222***0001</div>
          <span style={{fontSize:"0.6rem",fontWeight:700,letterSpacing:"0.1em",color:"#c9a84c",background:"rgba(201,168,76,0.12)",border:"1px solid rgba(201,168,76,0.25)",borderRadius:"4px",padding:"0.12rem 0.45rem",marginTop:"0.35rem",display:"inline-block"}}>MASTER AGENT</span>
        </div>
        <div style={{marginLeft:"auto",textAlign:"right"}}>
          <div style={{fontSize:"2.2rem",fontWeight:800,color:"var(--gold-bright)",fontFamily:"'Cormorant Garamond',serif",lineHeight:1}}>{DEMO_SUBS.length}</div>
          <div style={{fontSize:"0.6rem",color:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:"0.08em"}}>Sub-Agents</div>
        </div>
      </div>

      {/* Sub-Agent Roster */}
      <div style={{display:"flex",flexDirection:"column",gap:"0.6rem",marginBottom:"1.25rem"}}>
        {DEMO_SUBS.map(a => (
          <div key={a.ssId} style={{
            display:"flex", alignItems:"center", gap:"0.85rem",
            background:"rgba(255,255,255,0.02)", borderRadius:"9px", padding:"0.8rem 1rem",
            border:`1px solid ${STATUS_COLOR[a.status]}22`,
          }}>
            <span style={{fontSize:"1.2rem"}}>{a.bio ? "✅" : "⏳"}</span>
            <div style={{flex:1}}>
              <div style={{fontWeight:600,fontSize:"0.88rem",color:"#fff"}}>{a.name}</div>
              <div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.35)",marginTop:"0.1rem"}}>SS-ID: {a.ssId} · Bio: {a.bio ? "Active" : "Pending"}</div>
            </div>
            <span style={{fontSize:"0.65rem",fontWeight:700,letterSpacing:"0.08em",color:STATUS_COLOR[a.status],background:`${STATUS_COLOR[a.status]}18`,border:`1px solid ${STATUS_COLOR[a.status]}40`,borderRadius:"4px",padding:"0.12rem 0.5rem"}}>
              {a.status}
            </span>
          </div>
        ))}
      </div>

      {/* Launch KYA SDK Button */}
      <button className="btn btn--gold" onClick={openKYA} style={{marginBottom:"0.75rem"}}>
        🤝 Manage Sub-Agents — Open KYA Module
      </button>
      <p style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.3)",marginBottom:"0.5rem",lineHeight:1.65}}>
        Launches the <strong style={{color:"rgba(201,168,76,0.7)"}}>F12 · KYA Sovereign Modal</strong> — enroll new Sub-Agents, view the full roster, and manage the Chain of Trust. As Master Agent, you are legally responsible for all Sub-Agent transactions under CBN Policy.
      </p>

      {/* ── Divider ── */}
      <hr style={{border:"none",borderTop:"1px solid rgba(255,255,255,0.06)",margin:"2.5rem 0"}}/>

      {/* ── Other Settings Sections (non-KYA) ── */}
      <h2 style={{fontSize:"1rem",fontWeight:700,color:"rgba(255,255,255,0.5)",marginBottom:"1rem",letterSpacing:"0.04em"}}>
        Terminal Configuration
      </h2>
      {[
        { icon:"📟", label:"Terminal ID",       value:"POS-LGA-007 · Active" },
        { icon:"📍", label:"Location",           value:"Lagos Island LGA, Lagos State" },
        { icon:"🏦", label:"Settlement Account", value:"Access Bank · 00 2237 5891 04" },
        { icon:"💱", label:"Daily Limit",        value:"₦5,000,000 (Master Agent Tier)" },
        { icon:"🔐", label:"BSSS Compliance",    value:"Current · v2.4 · Last audit: 2 days ago" },
      ].map(r => (
        <div key={r.label} style={{display:"flex",alignItems:"center",gap:"0.9rem",padding:"0.85rem 0",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
          <span style={{fontSize:"1.2rem"}}>{r.icon}</span>
          <span style={{fontSize:"0.82rem",color:"rgba(255,255,255,0.38)",flex:"0 0 180px"}}>{r.label}</span>
          <span style={{fontSize:"0.82rem",color:"rgba(255,255,255,0.65)"}}>{r.value}</span>
        </div>
      ))}

    </div>
  );
}

