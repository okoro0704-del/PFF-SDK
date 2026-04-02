// ─── PFF-TRUST · Agent Settings Page ─────────────────────────────────────────
// KYA module is FORCE-INJECTED here — it is always the first, non-collapsible
// section. It cannot be hidden, moved, or dismissed by the host application.

import { useKYA } from "../kya/KYAModule";
import { KYARoster } from "../kya/KYARoster";

interface Props { onBack: () => void; }

export function AgentSettingsPage({ onBack }: Props) {
  const { profile, openEnroll, forceKYA } = useKYA();

  const handleForceOverride = () => forceKYA(
    "A delegated high-volume transaction (₦1,200,000) was attempted on a new device " +
    "without a verified Sub-Agent link. You must complete KYA Sub-Linkage before this " +
    "transaction can be authorized on this terminal."
  );

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
          KYA SECTION — FORCE-INJECTED BY F-MAN MIDDLEWARE
          Cannot be moved, hidden, or dismissed by host application.
          ════════════════════════════════════════════════════════════════════ */}
      <div className="kya-inject-banner">
        <span style={{fontSize:"1rem"}}>🔗</span>
        <span className="kya-inject-banner__label">KYA Module · Auto-Injected by F-Man Middleware · Know Your Agent</span>
        <span style={{marginLeft:"auto",fontSize:"0.62rem",color:"rgba(201,168,76,0.5)",fontFamily:"monospace"}}>
          SOVEREIGN · NON-DISMISSIBLE
        </span>
      </div>

      {/* Master Agent Identity Card */}
      <div className="kya-master-card">
        <div className="kya-master-avatar">🏆</div>
        <div>
          <div className="kya-master-name">{profile.displayName}</div>
          <div className="kya-master-id">Agent ID: {profile.agentId} · BVN: {profile.bvnMasked}</div>
          <span className="kya-master-tier">{profile.tier} AGENT</span>
        </div>
        <div style={{marginLeft:"auto",textAlign:"right"}}>
          <div style={{fontSize:"2rem",fontWeight:800,color:"var(--gold-bright)",fontFamily:"'Cormorant Garamond',serif",lineHeight:1}}>
            {profile.subAgents.length}
          </div>
          <div style={{fontSize:"0.62rem",color:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:"0.08em"}}>
            Sub-Agents
          </div>
        </div>
      </div>

      {/* Chain of Trust visual (always rendered) */}
      {profile.subAgents.length > 0 && (
        <div className="kya-chain" style={{marginBottom:"1.5rem"}}>
          <div className="kya-chain__node">
            🏆 {profile.displayName}
            <span style={{fontSize:"0.6rem",color:"#c9a84c",marginLeft:"0.5rem"}}>
              MASTER · {profile.agentId}
            </span>
          </div>
          {profile.subAgents.map((a) => (
            <div key={a.ssId} style={{display:"contents"}}>
              <div className="kya-chain__line"/>
              <div className="kya-chain__node" style={{
                borderColor: a.status === "ACTIVE" ? "rgba(34,197,94,0.3)" : "rgba(201,168,76,0.2)",
                background:  a.status === "ACTIVE" ? "rgba(34,197,94,0.04)" : undefined,
                fontSize:"0.75rem",
              }}>
                {a.status === "ACTIVE" ? "✅" : "⏳"} {a.displayName}
                <span style={{fontSize:"0.58rem",color:a.status==="ACTIVE"?"#22c55e":"#c9a84c",marginLeft:"0.5rem"}}>
                  {a.ssId}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* KYA Roster with Link & Force-Override controls */}
      <KYARoster
        subAgents={profile.subAgents}
        onLinkNew={openEnroll}
        onForceLink={handleForceOverride}
      />

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

