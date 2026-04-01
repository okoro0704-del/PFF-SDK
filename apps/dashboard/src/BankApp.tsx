import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BankLandingPage }  from "./pages/BankLandingPage";
import { ZfoeOnboarding }   from "./pages/ZfoeOnboarding";
import { BihGateway }       from "./pages/BihGateway";
import { BlsWithdrawal }    from "./pages/BlsWithdrawal";
import { BlideGateway }     from "./pages/BlideGateway";
import { ZfpsMonitor }      from "./pages/ZfpsMonitor";
import { OnboardingStageA } from "./pages/OnboardingStageA";
import type { StageAData }  from "./pages/OnboardingStageA";
import { OnboardingStageB } from "./pages/OnboardingStageB";

type BankView = "landing" | "apply-a" | "apply-b" | "zfoe" | "bih" | "bls" | "blide" | "zfps";

export function BankApp() {
  const navigate  = useNavigate();
  const [view, setView]           = useState<BankView>("landing");
  const [stageAData, setStageAData] = useState<StageAData | null>(null);

  const back = () => setView("landing");

  return (
    <div>
      {/* ── Bank Navbar ───────────────────────────────────────────────────── */}
      <nav className="navbar">
        <div className="navbar__brand" onClick={back} style={{ cursor: "pointer" }}>
          <span className="navbar__logo">PFF</span>
          <div>
            <div className="navbar__title">PFF-TRUST</div>
            <div className="navbar__sub">Bank &amp; Agent Portal</div>
          </div>
        </div>

        <div className="navbar__links">
          <button className="btn btn--ghost btn--sm" onClick={() => setView("zfps")}>⚡ Provisioning</button>
          <button className="btn btn--ghost btn--sm" onClick={() => setView("blide")}>🫦 Face Pay</button>
          <button className="btn btn--ghost btn--sm" onClick={() => setView("bls")}>🔍 BLS Sweep</button>
          <button className="btn btn--ghost btn--sm" onClick={() => setView("bih")}>☞ BIH Scan</button>
          <button className="btn btn--ghost btn--sm" onClick={() => setView("zfoe")}>🏦 ZFOE</button>
          <button
            className="btn btn--outline btn--sm"
            onClick={() => navigate("/admin")}
            style={{ fontSize: "0.7rem", opacity: 0.6 }}
          >
            Admin →
          </button>
        </div>
      </nav>

      {/* ── Views ─────────────────────────────────────────────────────────── */}
      {view === "landing" && (
        <BankLandingPage
          onZfoe={()  => setView("zfoe")}
          onBih={()   => setView("bih")}
          onBls={()   => setView("bls")}
          onBlide={()  => setView("blide")}
          onZfps={()  => setView("zfps")}
          onApply={()  => setView("apply-a")}
        />
      )}

      {view === "apply-a" && (
        <OnboardingStageA
          onBack={back}
          onSubmit={(data: StageAData) => { setStageAData(data); setView("apply-b"); }}
        />
      )}

      {view === "apply-b" && stageAData && (
        <OnboardingStageB
          stageAData={stageAData}
          onComplete={back}
          onBack={() => setView("apply-a")}
        />
      )}

      {view === "zfoe"  && <ZfoeOnboarding onBack={back} />}
      {view === "bih"   && <BihGateway     onBack={back} />}
      {view === "bls"   && <BlsWithdrawal  onBack={back} />}
      {view === "blide" && <BlideGateway   onBack={back} />}
      {view === "zfps"  && <ZfpsMonitor    onBack={back} />}
    </div>
  );
}

