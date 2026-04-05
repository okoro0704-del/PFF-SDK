import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLandingPage }       from "./pages/AdminLandingPage";
import { CommandCenter }          from "./pages/CommandCenter";
import { RsccDashboard }          from "./pages/RsccDashboard";
import { LegacyMonitor }          from "./pages/LegacyMonitor";
import { InstitutionalDashboard } from "./pages/InstitutionalDashboard";
import { KingmakerDashboard }     from "./pages/KingmakerDashboard";
import { OnboardingStageA }       from "./pages/OnboardingStageA";
import type { StageAData }        from "./pages/OnboardingStageA";
import { OnboardingStageB }       from "./pages/OnboardingStageB";

type AdminView = "landing" | "casd" | "rscc" | "monitor" | "institution" | "kingmaker" | "onboard-a" | "onboard-b";

export function AdminApp() {
  const navigate = useNavigate();
  const [view, setView]         = useState<AdminView>("landing");
  const [stageAData, setStageA] = useState<StageAData | null>(null);

  const back = () => setView("landing");

  return (
    <div style={{ minHeight: "100vh", background: "#060608", color: "#F0EBE0" }}>
      {/* ── Admin Navbar ──────────────────────────────────────────────────── */}
      <nav className="navbar" style={{ borderBottom: "1px solid rgba(201,168,76,0.35)" }}>
        <div className="navbar__brand" onClick={back} style={{ cursor: "pointer" }}>
          <span style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "1.3rem", fontWeight: 700,
            color: "#0a0a0a", background: "#E8C96D",
            padding: "0.1rem 0.5rem", borderRadius: "4px",
            letterSpacing: "0.05em",
          }}>ADM</span>
          <div>
            <div style={{ fontSize: "1rem", fontWeight: 600, color: "#E8C96D" }}>PFF-TRUST Admin</div>
            <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#E8C96D", opacity: 0.7 }}>Internal Control Plane</div>
          </div>
        </div>

        <div className="navbar__links">
          <button className="btn btn--ghost btn--sm" onClick={() => setView("casd")}>⚙️ CASD</button>
          <button className="btn btn--ghost btn--sm" onClick={() => setView("rscc")}>💰 RSCC</button>
          <button className="btn btn--ghost btn--sm" onClick={() => setView("monitor")}>📡 Monitor</button>
          <button className="btn btn--ghost btn--sm" onClick={() => setView("institution")}>🏛️ Institutional</button>
          <button className="btn btn--ghost btn--sm" onClick={() => setView("kingmaker")}>♛ Kingmaker</button>
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
          onKingmaker={() => setView("kingmaker")}
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
      {view === "kingmaker" && <KingmakerDashboard onBack={back} />}
    </div>
  );
}

