import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLandingPage }       from "./pages/AdminLandingPage";
import { CommandCenter }          from "./pages/CommandCenter";
import { RsccDashboard }          from "./pages/RsccDashboard";
import { LegacyMonitor }          from "./pages/LegacyMonitor";
import { InstitutionalDashboard } from "./pages/InstitutionalDashboard";
import { OnboardingStageA }       from "./pages/OnboardingStageA";
import type { StageAData }        from "./pages/OnboardingStageA";
import { OnboardingStageB }       from "./pages/OnboardingStageB";

type AdminView = "landing" | "casd" | "rscc" | "monitor" | "institution" | "onboard-a" | "onboard-b";

export function AdminApp() {
  const navigate = useNavigate();
  const [view, setView]         = useState<AdminView>("landing");
  const [stageAData, setStageA] = useState<StageAData | null>(null);

  const back = () => setView("landing");

  return (
    <div>
      {/* ── Admin Navbar ──────────────────────────────────────────────────── */}
      <nav className="navbar" style={{ borderBottom: "1px solid rgba(201,168,76,0.35)" }}>
        <div className="navbar__brand" onClick={back} style={{ cursor: "pointer" }}>
          <span className="navbar__logo" style={{ background: "var(--gold-bright)", color: "#0a0a0a" }}>ADM</span>
          <div>
            <div className="navbar__title">PFF-TRUST Admin</div>
            <div className="navbar__sub" style={{ color: "var(--gold-bright)" }}>Internal Control Plane</div>
          </div>
        </div>

        <div className="navbar__links">
          <button className="btn btn--ghost btn--sm" onClick={() => setView("casd")}>⚙️ CASD</button>
          <button className="btn btn--ghost btn--sm" onClick={() => setView("rscc")}>💰 RSCC</button>
          <button className="btn btn--ghost btn--sm" onClick={() => setView("monitor")}>📡 Monitor</button>
          <button className="btn btn--ghost btn--sm" onClick={() => setView("institution")}>🏛️ Institutional</button>
          <button
            className="btn btn--outline btn--sm"
            onClick={() => navigate("/")}
            style={{ fontSize: "0.7rem" }}
          >
            ← Bank Portal
          </button>
        </div>
      </nav>

      {/* ── Admin warning strip ───────────────────────────────────────────── */}
      <div style={{
        background: "rgba(201,168,76,0.06)", borderBottom: "1px solid var(--gold-border)",
        padding: "0.45rem 2rem", textAlign: "center",
        fontSize: "0.7rem", color: "var(--gold-bright)", letterSpacing: "0.12em",
      }}>
        🔒 RESTRICTED AREA · F-MAN TECHNOLOGIES INTERNAL · AUTHORISED ACCESS ONLY
      </div>

      {/* ── Views ─────────────────────────────────────────────────────────── */}
      {view === "landing" && (
        <AdminLandingPage
          onCasd={() => setView("casd")}
          onRscc={() => setView("rscc")}
          onMonitor={() => setView("monitor")}
          onInstitution={() => setView("onboard-a")}
        />
      )}
      {view === "casd"    && <CommandCenter onBack={back} />}
      {view === "rscc"    && <RsccDashboard onBack={back} />}
      {view === "monitor" && <LegacyMonitor />}

      {view === "onboard-a" && (
        <OnboardingStageA
          onBack={back}
          onSubmit={(data) => { setStageA(data); setView("onboard-b"); }}
        />
      )}
      {view === "onboard-b" && stageAData && (
        <OnboardingStageB
          stageAData={stageAData}
          onComplete={() => setView("institution")}
          onBack={() => setView("onboard-a")}
        />
      )}
      {view === "institution" && stageAData && (
        <InstitutionalDashboard institution={stageAData} />
      )}
    </div>
  );
}

