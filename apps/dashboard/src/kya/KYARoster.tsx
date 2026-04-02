// ─── PFF-TRUST · KYA — Sub-Agent Roster View ─────────────────────────────────
// Displays all linked sub-agents with status, bio-activation, terminal info

import type { SubAgent, SubStatus } from "./types";

const STATUS_LABEL: Record<SubStatus, string> = {
  "ACTIVE":       "Active",
  "PENDING_BIO":  "Pending Bio",
  "SUSPENDED":    "Suspended",
  "BLACKLISTED":  "Blacklisted",
};
const STATUS_CLASS: Record<SubStatus, string> = {
  "ACTIVE":       "kya-status--active",
  "PENDING_BIO":  "kya-status--pending-bio",
  "SUSPENDED":    "kya-status--suspended",
  "BLACKLISTED":  "kya-status--blacklisted",
};

function timeAgo(ms: number) {
  const d = Math.floor((Date.now() - ms) / 86_400_000);
  return d === 0 ? "Today" : d === 1 ? "Yesterday" : `${d} days ago`;
}

interface Props {
  subAgents:   SubAgent[];
  onLinkNew:   () => void;
  onForceLink: () => void;   // simulate high-volume override
}

export function KYARoster({ subAgents, onLinkNew, onForceLink }: Props) {
  const activeCount  = subAgents.filter(a => a.status === "ACTIVE").length;
  const bioCount     = subAgents.filter(a => a.bioActivated).length;

  return (
    <div>
      {/* ── Summary strip ── */}
      <div style={{display:"flex",gap:"1rem",marginBottom:"1.5rem",flexWrap:"wrap"}}>
        {[
          { label:"Total Sub-Agents", value:subAgents.length },
          { label:"Active",           value:activeCount },
          { label:"Bio Activated",    value:bioCount },
          { label:"Pending Bio",      value:subAgents.length - bioCount },
        ].map(s => (
          <div key={s.label} style={{flex:"1 1 100px",background:"rgba(201,168,76,0.05)",border:"1px solid rgba(201,168,76,0.13)",borderRadius:10,padding:"0.75rem 1rem"}}>
            <div style={{fontSize:"1.5rem",fontWeight:800,color:"var(--gold-bright)",fontFamily:"'Cormorant Garamond',serif"}}>{s.value}</div>
            <div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.38)",textTransform:"uppercase",letterSpacing:"0.08em",marginTop:"0.1rem"}}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── High-Volume Override Warning ── */}
      {subAgents.length === 0 && (
        <div style={{background:"rgba(239,68,68,0.07)",border:"1px solid rgba(239,68,68,0.25)",borderRadius:10,padding:"1rem 1.25rem",marginBottom:"1.25rem"}}>
          <p style={{fontSize:"0.8rem",color:"#ef4444",fontWeight:700,marginBottom:"0.3rem"}}>⚠️ High-Volume Operations Blocked</p>
          <p style={{fontSize:"0.75rem",color:"rgba(255,255,255,0.45)",lineHeight:1.6}}>
            No verified Sub-Agents are linked. Delegated high-volume transactions above ₦500,000
            are blocked until at least one Sub-Agent is bonded and biometrically activated.
          </p>
        </div>
      )}

      {/* ── Sub-Agent Cards ── */}
      {subAgents.length > 0 && (
        <div style={{marginBottom:"1.25rem"}}>
          {subAgents.map(agent => (
            <div key={agent.ssId} className="kya-sub-card">
              <div className="kya-sub-avatar">🧑</div>
              <div style={{flex:1,minWidth:0}}>
                <div className="kya-sub-name">{agent.displayName}</div>
                <div className="kya-sub-ssid">{agent.ssId}</div>
                <div className="kya-sub-meta">
                  BVN: {agent.bvnMasked} · Ph: {agent.phoneMasked}
                  {agent.terminalId && ` · 📟 ${agent.terminalId}`}
                  {" · "}Linked {timeAgo(agent.linkedAt)}
                </div>
              </div>
              <div className="kya-sub-actions">
                <span className={`kya-status ${STATUS_CLASS[agent.status]}`}>
                  {STATUS_LABEL[agent.status]}
                </span>
                <span style={{fontSize:"0.65rem",display:"flex",alignItems:"center",gap:"0.3rem",color:"rgba(255,255,255,0.35)"}}>
                  <span className={`kya-bio-dot ${agent.bioActivated ? "kya-bio-dot--on" : "kya-bio-dot--off"}`}/>
                  {agent.bioActivated ? "Bio Active" : "Bio Pending"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Actions ── */}
      <button className="kya-btn kya-btn--primary" onClick={onLinkNew}>
        🔗 Link New Sub-Agent
      </button>

      {/* ── Force-Override Demo ── */}
      <div style={{marginTop:"1.5rem",background:"rgba(239,68,68,0.05)",border:"1px solid rgba(239,68,68,0.18)",borderRadius:10,padding:"1rem 1.2rem"}}>
        <p style={{fontSize:"0.7rem",fontWeight:700,color:"#ef4444",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"0.4rem"}}>
          🔴 Demo: Force-Override Trigger
        </p>
        <p style={{fontSize:"0.75rem",color:"rgba(255,255,255,0.4)",lineHeight:1.6,marginBottom:"0.75rem"}}>
          Simulates what happens when a Master Agent attempts to delegate a high-volume transaction
          to a new device without an active Sub-Agent link. The system overrides the host UI and
          demands KYA Sub-Linkage first.
        </p>
        <button className="kya-btn kya-btn--danger" onClick={onForceLink}>
          ⚠️ Simulate High-Volume Override
        </button>
      </div>
    </div>
  );
}

