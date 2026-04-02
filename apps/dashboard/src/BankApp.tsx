import { useState, useEffect, useRef, type ReactNode } from "react";
import {
  BankLandingPage, WhoWeArePage, WhatWeDoPage,
  GetConnectedPage, ContactPage, CorePage,
} from "./pages/BankLandingPage";
import { SdkLaunchPage }      from "./pages/SdkLaunchPage";
import { BiometricSDKProvider } from "./sdk/BiometricSDK";
import { ZfoeOnboarding }   from "./pages/ZfoeOnboarding";
import { BihGateway }       from "./pages/BihGateway";
import { BlsWithdrawal }    from "./pages/BlsWithdrawal";
import { BlideGateway }     from "./pages/BlideGateway";
import { ZfpsMonitor }      from "./pages/ZfpsMonitor";
import { OnboardingStageA } from "./pages/OnboardingStageA";
import type { StageAData }  from "./pages/OnboardingStageA";
import { OnboardingStageB } from "./pages/OnboardingStageB";

type BankView =
  | "landing" | "who-we-are" | "what-we-do" | "get-connected" | "contact" | "core"
  | "apply-a" | "apply-b"
  | "zfoe" | "bih" | "bls" | "blide" | "zfps"
  | "sdk";

const CORE_VIEWS: BankView[] = ["core", "zfoe", "bih", "bls", "blide", "zfps", "sdk"];

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

export function BankApp() {
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
    <BiometricSDKProvider>
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
          {dd("core", "⚡ Core", CORE_VIEWS.includes(view), <>
            <p className="nav-dd__section">Live Services</p>
            <button className="nav-dd__item" onClick={() => go("zfoe")}>🏦 ZFOE — Open Account</button>
            <button className="nav-dd__item" onClick={() => go("bih")}>🧬 BIH — Biometric Identity Harvest</button>
            <button className="nav-dd__item" onClick={() => go("bls")}>💧 BLS — Liquidity Sweep</button>
            <button className="nav-dd__item" onClick={() => go("blide")}>🫦 BLIDE — Face Pay</button>
            <button className="nav-dd__item" onClick={() => go("zfps")}>📡 ZFPS — Provisioning Status</button>
            <div className="nav-dd__divider" />
            <button className="nav-dd__item" onClick={() => go("sdk")}>🔬 Biometric SDK — BAS · YES · AJO</button>
            <div className="nav-dd__divider" />
            <button className="nav-dd__item" onClick={() => go("core")}>📋 All Core Services</button>
          </>)}

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
      {view === "core"          && (
        <CorePage
          onZfoe={()  => setView("zfoe")}
          onBih={()   => setView("bih")}
          onBls={()   => setView("bls")}
          onBlide={()  => setView("blide")}
          onZfps={()  => setView("zfps")}
        />
      )}

      {view === "apply-a" && (
        <OnboardingStageA
          onBack={() => setView("get-connected")}
          onSubmit={(data: StageAData) => { setStageAData(data); setView("apply-b"); }}
        />
      )}
      {view === "apply-b" && stageAData && (
        <OnboardingStageB stageAData={stageAData} onComplete={back} onBack={() => setView("apply-a")} />
      )}

      {view === "zfoe"  && <ZfoeOnboarding onBack={() => setView("core")} />}
      {view === "bih"   && <BihGateway     onBack={() => setView("core")} />}
      {view === "bls"   && <BlsWithdrawal  onBack={() => setView("core")} />}
      {view === "blide" && <BlideGateway   onBack={() => setView("core")} />}
      {view === "zfps"  && <ZfpsMonitor    onBack={() => setView("core")} />}
      {view === "sdk"   && <SdkLaunchPage  onBack={() => setView("core")} />}

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
    </BiometricSDKProvider>
  );
}

