interface AdminLandingPageProps {
  onCasd:        () => void;
  onRscc:        () => void;
  onMonitor:     () => void;
  onInstitution: () => void;
  onKingmaker:   () => void;
}

const TOOLS = [
  {
    icon: "⚙️",
    title: "Command Center (CASD)",
    desc: "Bank onboarding pipeline — approve institutions, push sovereign documents, set switching tolls, and manage 31-day license clocks.",
    action: "onCasd" as const,
    badge: "BANK MANAGEMENT",
    gold: true,
  },
  {
    icon: "💰",
    title: "Revenue & Settlement (RSCC)",
    desc: "Live treasury view — 40/60 fee split ledger, agent network commissions, Ajo cycle tracking, and Sovryn batch settlement status.",
    action: "onRscc" as const,
    badge: "TREASURY",
    gold: true,
  },
  {
    icon: "📡",
    title: "System Monitor",
    desc: "Real-time NIBSS channel health, verification ledger analytics, identity mismatch alerts, and liquidity mirror snapshots.",
    action: "onMonitor" as const,
    badge: "OPS",
    gold: false,
  },
  {
    icon: "🏛️",
    title: "Institutional Dashboard",
    desc: "High-level institutional overview — enrolled subjects, execution layer stats, pulse sync, and unbanked profile pipeline.",
    action: "onInstitution" as const,
    badge: "OVERVIEW",
    gold: false,
  },
  {
    icon: "♛",
    title: "Kingmaker — Sovereign Vault",
    desc: "Liquidity Migration Rate dashboard — approve sovereign partner banks, monitor Day-31 vault flips, LMR TVL, legacy-to-sovereign capital routing, and the full audit trail.",
    action: "onKingmaker" as const,
    badge: "SOVEREIGN VAULT",
    gold: true,
  },
] as const;

export function AdminLandingPage({ onCasd, onRscc, onMonitor, onInstitution, onKingmaker }: AdminLandingPageProps) {
  const handlers = { onCasd, onRscc, onMonitor, onInstitution, onKingmaker };

  return (
    <div>
      {/* ── Admin Warning Banner ── */}
      <div style={{
        background: "rgba(201,168,76,0.08)", borderBottom: "1px solid var(--gold-border)",
        padding: "0.6rem 2rem", textAlign: "center", fontSize: "0.75rem",
        color: "var(--gold-bright)", letterSpacing: "0.12em",
      }}>
        🔒 RESTRICTED — F-MAN TECHNOLOGIES INTERNAL PORTAL · AUTHORISED PERSONNEL ONLY
      </div>

      {/* ── Hero ── */}
      <div style={{
        minHeight: "45vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", textAlign: "center",
        padding: "3rem 2rem",
        background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(201,168,76,0.06) 0%, transparent 70%)",
      }}>
        <span className="badge badge--gold" style={{ fontSize: "0.65rem", letterSpacing: "0.18em", marginBottom: "1.25rem" }}>
          ◈ ADMIN CONTROL PLANE
        </span>

        <h1 className="serif" style={{ fontSize: "clamp(2rem,4vw,3.5rem)", marginBottom: "1rem", lineHeight: 1.1 }}>
          PFF-TRUST <span style={{ color: "var(--gold-bright)" }}>Admin Dashboard</span>
        </h1>

        <p style={{ maxWidth: 520, fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: 1.7 }}>
          Command centre for bank onboarding, revenue settlement, NIBSS pipeline monitoring,
          and institutional health across the entire sovereign payment stack.
        </p>
      </div>

      {/* ── Admin Tools Grid ── */}
      <div className="container" style={{ padding: "2rem 2rem 5rem" }}>
        <div className="grid-2" style={{ gap: "1.5rem" }}>
          {TOOLS.map((t) => (
            <div key={t.title} className="pillar-card" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ fontSize: "1.8rem" }}>{t.icon}</span>
                <span className="badge badge--gold" style={{ fontSize: "0.6rem", letterSpacing: "0.1em" }}>{t.badge}</span>
              </div>
              <h3 style={{ margin: 0 }}>{t.title}</h3>
              <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.88rem", lineHeight: 1.65, flex: 1 }}>{t.desc}</p>
              <button
                className={t.gold ? "btn btn--gold" : "btn btn--outline"}
                onClick={handlers[t.action]}
                style={{ alignSelf: "flex-start" }}
              >
                Open {t.title.split("(")[0].trim()} →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

