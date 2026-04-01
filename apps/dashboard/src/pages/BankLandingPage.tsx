interface BankLandingPageProps {
  onZfoe:  () => void;
  onBih:   () => void;
  onBls:   () => void;
  onBlide: () => void;
  onZfps:  () => void;
  onApply: () => void;
}

const SERVICES = [
  {
    icon: "🏦",
    title: "Instant Account Opening (ZFOE)",
    desc: "Open a CBN Tier-1 account in under 60 seconds using only a phone number and biometric scan. No paperwork. No branch visit.",
    action: "onZfoe" as const,
    label: "Open Account →",
    gold: true,
  },
  {
    icon: "☞",
    title: "Scan-to-Onboard (BIH)",
    desc: "10-fingerprint harvest links a citizen's biometric to all their existing bank accounts. One scan, full account discovery.",
    action: "onBih" as const,
    label: "Start BIH Scan",
    gold: false,
  },
  {
    icon: "🔍",
    title: "Biometric Liquidity Sweep (BLS)",
    desc: "Discover and consolidate balances across all linked accounts with a single fingerprint. Authorise multi-bank withdrawals instantly.",
    action: "onBls" as const,
    label: "Start Sweep",
    gold: false,
  },
  {
    icon: "🫦",
    title: "Active-Liveness Face Pay (BLIDE)",
    desc: "Pay with your face. A 7-task randomised liveness challenge ensures the person is live and present. Sub-60s from scan to debit.",
    action: "onBlide" as const,
    label: "Face Pay →",
    gold: true,
  },
  {
    icon: "⚡",
    title: "Provisioning Monitor (ZFPS)",
    desc: "Real-time dashboard showing account creation pulse, bank CBS latency, ISO 20022 messages, and SMS delivery status.",
    action: "onZfps" as const,
    label: "View Pulse",
    gold: false,
  },
] as const;

export function BankLandingPage({ onZfoe, onBih, onBls, onBlide, onZfps, onApply }: BankLandingPageProps) {
  const handlers = { onZfoe, onBih, onBls, onBlide, onZfps, onApply };

  return (
    <div>
      {/* ── Hero ── */}
      <div style={{
        minHeight: "72vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", textAlign: "center",
        padding: "4rem 2rem",
        background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(201,168,76,0.07) 0%, transparent 70%)",
      }}>
        <span className="badge badge--gold" style={{ fontSize: "0.65rem", letterSpacing: "0.18em", marginBottom: "1.5rem" }}>
          ◈ BANK &amp; AGENT PORTAL
        </span>

        <h1 className="serif" style={{ fontSize: "clamp(2.2rem,5vw,4.2rem)", marginBottom: "1.25rem", lineHeight: 1.08 }}>
          Biometric Banking<br />
          <span style={{ color: "var(--gold-bright)" }}>for Every Nigerian</span>
        </h1>

        <p style={{ maxWidth: 580, fontSize: "1rem", color: "var(--text-muted)", lineHeight: 1.75, marginBottom: "2.5rem" }}>
          Open accounts, sweep balances, and authorise payments — all with a fingerprint or face scan.
          No card. No PIN. No branch visit. Powered by NIBSS and the National Payment Stack.
        </p>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
          <button className="btn btn--gold btn--lg" onClick={onBlide}>🫦 Face Pay Now</button>
          <button className="btn btn--gold btn--lg" onClick={onZfoe}>🏦 Open Account</button>
          <button className="btn btn--outline" onClick={onApply}>Apply for API Access →</button>
        </div>

        <div style={{ position: "absolute", bottom: 0, left: "10%", right: "10%", height: 1,
          background: "linear-gradient(90deg,transparent,var(--gold-border),transparent)" }} />
      </div>

      {/* ── Services Grid ── */}
      <div className="container" style={{ padding: "4rem 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p className="panel-title" style={{ marginBottom: "0.6rem" }}>Services</p>
          <h2 className="serif">What would you like to do?</h2>
        </div>

        <div className="grid-2" style={{ gap: "1.5rem" }}>
          {SERVICES.map((s) => (
            <div key={s.title} className="pillar-card" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <span style={{ fontSize: "2rem" }}>{s.icon}</span>
              <h3 style={{ margin: 0 }}>{s.title}</h3>
              <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.65, flex: 1 }}>{s.desc}</p>
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
    </div>
  );
}

