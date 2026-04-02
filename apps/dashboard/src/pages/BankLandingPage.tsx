interface BankLandingPageProps {
  onZfoe:  () => void;
  onBih:   () => void;
  onBls:   () => void;
  onBlide: () => void;
  onZfps:  () => void;
  onApply: () => void;
}

// ── Who We Are ────────────────────────────────────────────────────────────────
const WHO_WE_ARE = [
  {
    icon: "🇳🇬",
    title: "Built for Nigeria",
    body: "PFF-TRUST is sovereign biometric payment infrastructure designed specifically for Nigeria's unbanked and underbanked population — 40 million citizens and counting.",
  },
  {
    icon: "🔗",
    title: "NIBSS-Powered",
    body: "Every identity verification, account lookup, and transaction passes through the Nigeria Inter-Bank Settlement System — the gold standard for Nigerian payment rails.",
  },
  {
    icon: "🏛️",
    title: "CBN-Compliant",
    body: "Full compliance with Central Bank of Nigeria Tier-1 KYC guidelines. Onboard citizens, open accounts, and authorise payments — all within the regulatory perimeter.",
  },
] as const;

// ── What We Do ────────────────────────────────────────────────────────────────
const SERVICES = [
  {
    icon: "🏦",
    code: "ZFOE",
    title: "Instant Account Opening",
    desc: "Open a CBN Tier-1 account in under 60 seconds using only a phone number and biometric scan. No paperwork. No branch visit.",
    action: "onZfoe" as const,
    label: "Open Account →",
    gold: true,
  },
  {
    icon: "☞",
    code: "BIH",
    title: "Biometric Identity Harvest",
    desc: "10-fingerprint harvest links a citizen's biometric to all their existing bank accounts. One scan, full account discovery.",
    action: "onBih" as const,
    label: "Start BIH Scan →",
    gold: false,
  },
  {
    icon: "🔍",
    code: "BLS",
    title: "Biometric Liquidity Sweep",
    desc: "Discover and consolidate balances across all linked accounts with a single fingerprint. Authorise multi-bank withdrawals instantly.",
    action: "onBls" as const,
    label: "Start Sweep →",
    gold: false,
  },
  {
    icon: "🫦",
    code: "BLIDE",
    title: "Active-Liveness Face Pay",
    desc: "Pay with your face. A 7-task randomised liveness challenge ensures the person is live and present. Sub-60s from scan to debit.",
    action: "onBlide" as const,
    label: "Face Pay →",
    gold: true,
  },
  {
    icon: "⚡",
    code: "ZFPS",
    title: "Provisioning Pulse Monitor",
    desc: "Real-time dashboard showing account creation pulse, bank CBS latency, ISO 20022 messages, and SMS delivery status.",
    action: "onZfps" as const,
    label: "View Pulse →",
    gold: false,
  },
] as const;

// ── Get Connected ─────────────────────────────────────────────────────────────
const CONNECT = [
  {
    icon: "🏦",
    title: "Banks & Fintechs",
    body: "Access ZFOE, BLIDE, and BIH APIs. White-label biometric onboarding and payments for your existing customers.",
  },
  {
    icon: "🤝",
    title: "Agent Network",
    body: "Become an authorised PFF-TRUST agent. Earn 60% of every transaction fee for every citizen you onboard.",
  },
  {
    icon: "⚙️",
    title: "Developers",
    body: "RESTful APIs, ISO 20022 message formats, Webhooks, and a full Sandbox environment with complete documentation.",
  },
] as const;

export function BankLandingPage({ onZfoe, onBih, onBls, onBlide, onZfps, onApply }: BankLandingPageProps) {
  const handlers = { onZfoe, onBih, onBls, onBlide, onZfps };

  return (
    <div>

      {/* ════════════════════════════ HERO ════════════════════════════════════ */}
      <div style={{
        minHeight: "88vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", textAlign: "center",
        padding: "5rem 2rem 4rem", position: "relative",
        background: "radial-gradient(ellipse 90% 60% at 50% -5%, rgba(201,168,76,0.10) 0%, transparent 68%)",
      }}>
        <span className="badge badge--gold" style={{ fontSize: "0.62rem", letterSpacing: "0.24em", marginBottom: "2rem" }}>
          ◈ BANK &amp; FINTECH PORTAL
        </span>

        <h1 className="serif" style={{ fontSize: "clamp(3rem,7vw,5.5rem)", marginBottom: "0.6rem", lineHeight: 1.02 }}>
          PFF-TRUST SYSTEM
        </h1>

        <p style={{ fontSize: "clamp(0.95rem,2vw,1.2rem)", color: "var(--gold-bright)", letterSpacing: "0.1em", marginBottom: "1.6rem", fontWeight: 500 }}>
          Sovereign Biometric Identity &amp; Payment Infrastructure
        </p>

        <p style={{ maxWidth: 600, fontSize: "1rem", color: "var(--text-muted)", lineHeight: 1.85, marginBottom: "3rem" }}>
          Open accounts, sweep balances, and authorise payments — all with a fingerprint or face scan.
          No card. No PIN. No branch visit. Powered by NIBSS and the National Payment Stack.
        </p>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
          <button className="btn btn--gold btn--lg" onClick={onBlide}>🫦 Face Pay Now</button>
          <button className="btn btn--gold btn--lg" onClick={onZfoe}>🏦 Open Account</button>
          <button className="btn btn--outline btn--lg" onClick={onApply}>Get Connected →</button>
        </div>

        <div style={{
          position: "absolute", bottom: 0, left: "8%", right: "8%", height: 1,
          background: "linear-gradient(90deg, transparent, var(--gold-border), transparent)",
        }} />
      </div>

      {/* ══════════════════════════ WHO WE ARE ════════════════════════════════ */}
      <div style={{ background: "var(--bg-surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="container" style={{ padding: "5rem 2rem" }}>

          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <p className="panel-title" style={{ marginBottom: "0.6rem" }}>Who We Are</p>
            <h2 className="serif" style={{ marginBottom: "1.25rem" }}>
              The Infrastructure Behind{" "}
              <span style={{ color: "var(--gold-bright)" }}>Biometric Banking</span>
            </h2>
            <p style={{ maxWidth: 620, margin: "0 auto", color: "var(--text-muted)", fontSize: "0.97rem", lineHeight: 1.85 }}>
              F-MAN Technologies built PFF-TRUST to be the definitive national stack for biometric-first
              financial services — connecting every Nigerian to the payment system through their biology,
              not their documents.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
            {WHO_WE_ARE.map((item) => (
              <div key={item.title} className="panel--gold" style={{ textAlign: "center" }}>
                <div style={{ fontSize: "2.6rem", marginBottom: "1rem" }}>{item.icon}</div>
                <h3 style={{ marginBottom: "0.75rem", fontSize: "1.1rem" }}>{item.title}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", lineHeight: 1.75, margin: 0 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════ WHAT WE DO ════════════════════════════════ */}
      <div className="container" style={{ padding: "5rem 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <p className="panel-title" style={{ marginBottom: "0.6rem" }}>What We Do</p>
          <h2 className="serif">
            Five Pillars of{" "}
            <span style={{ color: "var(--gold-bright)" }}>Biometric Finance</span>
          </h2>
        </div>

        <div className="grid-2" style={{ gap: "1.5rem" }}>
          {SERVICES.map((s) => (
            <div key={s.code} className="pillar-card" style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ fontSize: "2rem" }}>{s.icon}</span>
                <span className="badge badge--gold" style={{ fontSize: "0.58rem", letterSpacing: "0.12em" }}>{s.code}</span>
              </div>
              <h3 style={{ margin: 0 }}>{s.title}</h3>
              <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.7, flex: 1 }}>{s.desc}</p>
              <button
                className={s.gold ? "btn btn--gold" : "btn btn--outline"}
                onClick={handlers[s.action]}
                style={{ alignSelf: "flex-start" }}
              >
                {s.label}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════ GET CONNECTED ═══════════════════════════════ */}
      <div style={{ background: "var(--bg-surface)", borderTop: "1px solid var(--gold-border)" }}>
        <div className="container" style={{ padding: "5rem 2rem", textAlign: "center" }}>

          <p className="panel-title" style={{ marginBottom: "0.6rem" }}>Get Connected</p>
          <h2 className="serif" style={{ marginBottom: "1.25rem" }}>
            Integrate PFF-TRUST into{" "}
            <span style={{ color: "var(--gold-bright)" }}>Your Platform</span>
          </h2>
          <p style={{ maxWidth: 580, margin: "0 auto 3rem", color: "var(--text-muted)", fontSize: "0.97rem", lineHeight: 1.85 }}>
            Banks, fintechs, and licensed agents can plug directly into the PFF-TRUST stack.
            Get API credentials, NIBSS channel access, and full onboarding support from our integration team.
          </p>

          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "3rem" }}>
            {CONNECT.map((c) => (
              <div key={c.title} className="panel--gold" style={{ textAlign: "left", flex: "1 1 240px", maxWidth: 300 }}>
                <div style={{ fontSize: "1.8rem", marginBottom: "0.75rem" }}>{c.icon}</div>
                <h4 style={{ color: "var(--gold-bright)", marginBottom: "0.5rem" }}>{c.title}</h4>
                <p style={{ color: "var(--text-muted)", fontSize: "0.86rem", lineHeight: 1.75, margin: 0 }}>{c.body}</p>
              </div>
            ))}
          </div>

          <button className="btn btn--gold btn--lg" onClick={onApply}>
            Apply for API Access →
          </button>

        </div>
      </div>

    </div>
  );
}

