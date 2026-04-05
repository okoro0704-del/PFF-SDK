import { useState, useEffect, useRef, type ReactNode } from "react";
import {
  BankLandingPage, WhoWeArePage, WhatWeDoPage,
  GetConnectedPage, ContactPage,
} from "./pages/BankLandingPage";
import { AgentSettingsPage }    from "./pages/AgentSettingsPage";
import { OnboardingStageA }    from "./pages/OnboardingStageA";
import type { StageAData }     from "./pages/OnboardingStageA";
import { OnboardingStageB }    from "./pages/OnboardingStageB";
import { UnifiedSDKProvider, UnifiedSDKDashboard, usePFFTrust } from "./unified-sdk";

type BankView =
  | "landing" | "who-we-are" | "what-we-do" | "get-connected" | "contact" | "core"
  | "apply-a" | "apply-b" | "sdk" | "settings";

const CORE_VIEWS: BankView[] = ["core", "sdk"];

const PARTNERS = [
  { name: "Access Bank",          emoji: "🏦" },
  { name: "Zenith Bank",          emoji: "🏦" },
  { name: "GTBank",               emoji: "🏦" },
  { name: "First Bank of Nigeria",emoji: "🏦" },
  { name: "UBA",                  emoji: "🏦" },
  { name: "FCMB",                 emoji: "🏦" },
  { name: "Fidelity Bank",        emoji: "🏦" },
  { name: "Union Bank",           emoji: "🏦" },
  { name: "Sterling Bank",        emoji: "🏦" },
  { name: "Polaris Bank",         emoji: "🏦" },
  { name: "Wema Bank",            emoji: "🏦" },
  { name: "Keystone Bank",        emoji: "🏦" },
  { name: "Providus Bank",        emoji: "🏦" },
  { name: "Moniepoint MFB",       emoji: "🏦" },
  { name: "Stanbic IBTC Bank",    emoji: "🏦" },
  { name: "Jaiz Bank",            emoji: "🕌" },
];

function BankAppInner() {
  const [view, setView]             = useState<BankView>("landing");
  const [stageAData, setStageAData] = useState<StageAData | null>(null);
  const [openDD, setOpenDD]         = useState<string | null>(null);
  const navRef                      = useRef<HTMLElement>(null);

  const back   = () => { setView("landing"); setOpenDD(null); };
  const go     = (v: BankView) => { setView(v); setOpenDD(null); };
  const toggle = (id: string) => setOpenDD(p => (p === id ? null : id));

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenDD(null);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const dd = (id: string, label: string, active: boolean, content: ReactNode, wide = false) => (
    <div className="nav-dd" key={id}>
      <button
        className={`btn btn--sm ${active || openDD === id ? "btn--gold" : "btn--ghost"}`}
        onClick={() => toggle(id)}
      >
        {label}&thinsp;<span style={{ fontSize: "0.55em", opacity: 0.6 }}>▾</span>
      </button>
      {openDD === id && (
        <div className={`nav-dd__menu${wide ? " nav-dd__menu--wide" : ""}`}>{content}</div>
      )}
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* ── Navbar ────────────────────────────────────────────────────────── */}
      <nav className="navbar" ref={navRef}>
        <div className="navbar__brand" onClick={back} style={{ cursor: "pointer" }}>
          <span className="navbar__logo">PFF</span>
          <div>
            <div className="navbar__title">PFF-TRUST SYSTEM</div>
            <div className="navbar__sub">Bank &amp; Fintech Portal</div>
          </div>
        </div>

        <div className="navbar__links">
          {/* ── Who We Are dropdown ── */}
          {dd("who", "Who We Are", view === "who-we-are", <>
            <p className="nav-dd__section">About PFF-TRUST</p>
            <button className="nav-dd__item" onClick={() => go("who-we-are")}>🏛️ Our Identity &amp; Mission</button>
            <button className="nav-dd__item" onClick={() => go("who-we-are")}>🇳🇬 Built for Nigeria</button>
            <button className="nav-dd__item" onClick={() => go("who-we-are")}>🔗 NIBSS Integration</button>
            <button className="nav-dd__item" onClick={() => go("who-we-are")}>✅ CBN-Compliant Infrastructure</button>
            <div className="nav-dd__divider" />
            <button className="nav-dd__item" onClick={() => go("who-we-are")}>⚙️ F-MAN Technologies</button>
          </>)}

          {/* ── What We Do dropdown ── */}
          {dd("what", "What We Do", view === "what-we-do", <>
            <p className="nav-dd__section">Our Products</p>
            <button className="nav-dd__item" onClick={() => go("what-we-do")}>🏦 ZFOE — Account Opening</button>
            <button className="nav-dd__item" onClick={() => go("what-we-do")}>🧬 BIH — Identity Harvest</button>
            <button className="nav-dd__item" onClick={() => go("what-we-do")}>💧 BLS — Liquidity Sweep</button>
            <button className="nav-dd__item" onClick={() => go("what-we-do")}>🫦 BLIDE — Face Pay</button>
            <button className="nav-dd__item" onClick={() => go("what-we-do")}>📡 ZFPS — Provisioning Monitor</button>
          </>)}

          {/* ── Get Connected dropdown ── */}
          {dd("connect", "Get Connected", ["get-connected","apply-a","apply-b"].includes(view), <>
            <p className="nav-dd__section">Who Are You?</p>
            <button className="nav-dd__item" onClick={() => go("get-connected")}>🏦 Banks &amp; Fintechs</button>
            <button className="nav-dd__item" onClick={() => go("get-connected")}>🤝 Agent Network</button>
            <button className="nav-dd__item" onClick={() => go("get-connected")}>⚙️ Developers</button>
            <div className="nav-dd__divider" />
            <button className="nav-dd__item" onClick={() => go("apply-a")}>📋 Apply for API Access →</button>
            <SDKKingmakerBtn />
          </>)}

          {/* ── Contact dropdown ── */}
          {dd("contact", "Contact", view === "contact", <>
            <p className="nav-dd__section">Reach Us</p>
            <button className="nav-dd__item" onClick={() => go("contact")}>📧 General Enquiries</button>
            <button className="nav-dd__item" onClick={() => go("contact")}>🛠️ Technical / API Support</button>
            <button className="nav-dd__item" onClick={() => go("contact")}>🤝 Partnerships</button>
            <button className="nav-dd__item" onClick={() => go("contact")}>📍 Head Office</button>
          </>)}

          {/* ── Our Partners dropdown ── */}
          {dd("partners", "🤝 Our Partners", false, <>
            <p className="nav-dd__section">Partnered Banks &amp; Institutions</p>
            <div className="nav-dd__grid">
              {PARTNERS.map(p => (
                <span key={p.name} className="nav-dd__item nav-dd__item--static">
                  {p.emoji} {p.name}
                </span>
              ))}
            </div>
          </>, true)}

          {/* ── Core services dropdown ── */}
          {dd("core", "⚡ Core", CORE_VIEWS.includes(view), <SDKNavItems go={go} />)}

          {/* ── Settings ── */}
          <span style={{ width:1, background:"var(--border)", alignSelf:"stretch", margin:"0 0.1rem" }} />
          <button
            className={`btn btn--sm ${view === "settings" ? "btn--gold" : "btn--ghost"}`}
            onClick={() => go("settings")}
            title="Agent Settings & KYA"
          >
            ⚙️
          </button>

          {/* ── Back to Dashboard ── */}
          {view !== "landing" && (
            <>
              <span style={{ width: 1, background: "var(--border)", alignSelf: "stretch", margin: "0 0.25rem" }} />
              <button className="btn btn--outline btn--sm" onClick={back} style={{ fontSize: "0.78rem" }}>
                ← Dashboard
              </button>
            </>
          )}
        </div>
      </nav>

      {/* ── Views ─────────────────────────────────────────────────────────── */}
      {view === "landing"       && <BankLandingPage onCore={() => setView("core")} onConnect={() => setView("get-connected")} />}
      {view === "who-we-are"    && <WhoWeArePage />}
      {view === "what-we-do"    && <WhatWeDoPage />}
      {view === "get-connected" && <GetConnectedPage onApply={() => setView("apply-a")} />}
      {view === "contact"       && <ContactPage />}
      {view === "core"    && <UnifiedSDKDashboard onBack={back} />}

      {view === "apply-a" && (
        <OnboardingStageA
          onBack={() => setView("get-connected")}
          onSubmit={(data: StageAData) => { setStageAData(data); setView("apply-b"); }}
        />
      )}
      {view === "apply-b" && stageAData && (
        <OnboardingStageB stageAData={stageAData} onComplete={back} onBack={() => setView("apply-a")} />
      )}
      {view === "sdk"      && <UnifiedSDKDashboard onBack={() => setView("core")} />}
      {view === "settings" && <AgentSettingsPage   onBack={back} />}

      {/* ── spacer so footer is always at the bottom ──────────────────────── */}
      <div style={{ flex: 1 }} />

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer style={{
        borderTop: "1px solid var(--gold-border)",
        background: "var(--bg-surface)",
        padding: "2.5rem 2rem",
        textAlign: "center",
      }}>
        <p style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "1.05rem",
          fontWeight: 600,
          color: "var(--gold-bright)",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          marginBottom: "0.5rem",
        }}>
          A Product of F-MAN TECHNOLOGIES
        </p>
        <p style={{ fontSize: "0.75rem", color: "var(--text-dim)", letterSpacing: "0.06em" }}>
          © {new Date().getFullYear()} F-Man Technologies Ltd. · PFF-TRUST is sovereign biometric infrastructure for Nigeria.
          · All rights reserved.
        </p>
      </footer>
    </div>
  );
}

// ── SDKNavItems — needs usePFFTrust hook, so lives inside provider ─────────────
function SDKNavItems({ go }: { go: (v: BankView) => void }) {
  const { launch } = usePFFTrust();
  const H = "bank-portal";
  const noop = () => {};
  return (<>
    <p className="nav-dd__section">Biometric Functions</p>
    <button className="nav-dd__item" onClick={()=>launch({fn:"ZFOE",  cfg:{hostAppId:H,onSuccess:noop,onAbort:noop}})}>🏦 ZFOE — Open Account</button>
    <button className="nav-dd__item" onClick={()=>launch({fn:"BIH",   cfg:{hostAppId:H,sessionRef:`BIH-${Date.now()}`,onSuccess:noop,onAbort:noop}})}>🧬 BIH — Identity Harvest</button>
    <button className="nav-dd__item" onClick={()=>launch({fn:"BLS",   cfg:{hostAppId:H,accountRef:"ACC-001",amountMinor:5000000,onSuccess:noop,onAbort:noop}})}>💧 BLS — Liquidity Sweep</button>
    <button className="nav-dd__item" onClick={()=>launch({fn:"BLIDE", cfg:{hostAppId:H,ref:`BLIDE-${Date.now()}`,amount:25000,beneficiary:"Demo",onSuccess:noop,onAbort:noop}})}>🫦 BLIDE — Face Pay</button>
    <button className="nav-dd__item" onClick={()=>launch({fn:"ZFPS",  cfg:{hostAppId:H,onSuccess:noop,onAbort:noop}})}>📡 ZFPS — Provisioning</button>
    <button className="nav-dd__item" onClick={()=>launch({fn:"BEPWG", cfg:{hostAppId:H,ref:`BEPWG-${Date.now()}`,amountMinor:2000000,onSuccess:noop,onAbort:noop}})}>📍 BEPWG — Proximity Gate</button>
    <button className="nav-dd__item" onClick={()=>launch({fn:"LBAS",  cfg:{hostAppId:H,challengeRef:`LBAS-${Date.now()}`,onSuccess:noop,onAbort:noop}})}>🎭 LBAS — Live Auth</button>
    <button className="nav-dd__item" onClick={()=>launch({fn:"UNWP",  cfg:{hostAppId:H,ref:`UNWP-${Date.now()}`,amountMinor:500000,onSuccess:noop,onAbort:noop}})}>💵 UNWP — Unbanked Withdrawal</button>
    <div className="nav-dd__divider"/>
    <button className="nav-dd__item" onClick={()=>launch({fn:"BAS",      cfg:{hostAppId:H,tier:1,onSuccess:noop,onAbort:noop}})}>🖐️ BAS — Account Setup</button>
    <button className="nav-dd__item" onClick={()=>launch({fn:"YES_CALL", cfg:{hostAppId:H,ref:`YES-${Date.now()}`,amount:50000,beneficiary:"Demo",onSuccess:noop,onAbort:noop}})}>✅ YES — Auth Gate</button>
    <button className="nav-dd__item" onClick={()=>launch({fn:"SSA",      cfg:{hostAppId:H,targetAmount:100000,onSuccess:noop,onAbort:noop}})}>🔒 SSA — AJO Savings</button>
    <button className="nav-dd__item" onClick={()=>launch({fn:"KYA",      cfg:{hostAppId:H,masterAgentId:"MA-001",onSuccess:noop,onAbort:noop}})}>🤝 KYA — Sub-Agent Link</button>
    <div className="nav-dd__divider"/>
    <button className="nav-dd__item" onClick={()=>go("sdk")}>📋 All 13 Functions →</button>
  </>);
}

// ── SDKKingmakerBtn ────────────────────────────────────────────────────────────
function SDKKingmakerBtn() {
  const { launch } = usePFFTrust();
  return (
    <button className="nav-dd__item" style={{color:"var(--gold-bright)",fontWeight:600}}
      onClick={()=>launch({fn:"KINGMAKER",cfg:{hostAppId:"bank-portal",onSuccess:()=>{},onAbort:()=>{}}})}>
      ♛ Join the Table — Sovereign Partner →
    </button>
  );
}

// ── BankApp — the single export: always wrapped in UnifiedSDKProvider ─────────
// App.tsx imports { BankApp } so this named export must include the provider.
export function BankApp() {
  return (
    <UnifiedSDKProvider>
      <BankAppInner />
    </UnifiedSDKProvider>
  );
}

