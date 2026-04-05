// ─── PFF-TRUST · Unified Sovereign SDK — Provider & Portal Engine ─────────────
// Force-injects a sovereign UI overlay (z-index 99999) over ANY host application.
// Only activates when the host app's VerifiedBusinessProfile status = VERIFIED.

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "./sovereign.css";
import type { SDKPayload, BusinessProfile } from "./types";
import { BusinessProfileGate } from "./BusinessProfileGate";

// ── Lazy-load all 13 modals (tree-shaking safe) ───────────────────────────────
import { F01_BAS }       from "./modals/F01_BAS";
import { F02_ZFOE }      from "./modals/F02_ZFOE";
import { F03_BIH }       from "./modals/F03_BIH";
import { F04_BLS }       from "./modals/F04_BLS";
import { F05_BLIDE }     from "./modals/F05_BLIDE";
import { F06_ZFPS }      from "./modals/F06_ZFPS";
import { F07_YES }       from "./modals/F07_YES";
import { F08_SSA }       from "./modals/F08_SSA";
import { F09_BEPWG }     from "./modals/F09_BEPWG";
import { F10_LBAS }      from "./modals/F10_LBAS";
import { F11_UNWP }      from "./modals/F11_UNWP";
import { F12_KYA }       from "./modals/F12_KYA";
import { F13_KINGMAKER } from "./modals/F13_KINGMAKER";

const API = "/api";
const HOST_APP_ID = "bank-portal";

// ── Context ───────────────────────────────────────────────────────────────────
interface SDKContextValue {
  launch:  (payload: SDKPayload) => void;
  close:   () => void;
  profile: BusinessProfile | null;
  profileLoading: boolean;
}
const SDKContext = createContext<SDKContextValue | null>(null);

export function usePFFTrust() {
  const ctx = useContext(SDKContext);
  if (!ctx) throw new Error("usePFFTrust must be used inside <UnifiedSDKProvider>");
  return ctx;
}

// ── Provider ──────────────────────────────────────────────────────────────────
export function UnifiedSDKProvider({ children }: { children: React.ReactNode }) {
  const [active,   setActive]   = useState<SDKPayload | null>(null);
  const [showGate, setShowGate] = useState(false);
  const [pendingPayload, setPending] = useState<SDKPayload | null>(null);
  const [profile, setProfile]   = useState<BusinessProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // ── Silently check profile on mount ──────────────────────────────────────
  useEffect(() => {
    fetch(`${API}/v1/sdk/profile/check?hostAppId=${HOST_APP_ID}`)
      .then(r => r.json())
      .then((d: BusinessProfile) => setProfile(d))
      .catch(() => setProfile({ status: "NOT_REGISTERED", verified: false }))
      .finally(() => setProfileLoading(false));
  }, []);

  // ── Register window.PFFTrust global launcher ──────────────────────────────
  useEffect(() => {
    (window as unknown as Record<string, unknown>)["PFFTrust"] = { launch };
    return () => { delete (window as unknown as Record<string, unknown>)["PFFTrust"]; };
  }); // eslint-disable-line

  const launch = useCallback((payload: SDKPayload) => {
    // If profile not verified → show gate first, queue payload
    if (!profile?.verified) {
      setPending(payload);
      setShowGate(true);
      return;
    }
    setActive(payload);
  }, [profile]);

  const close = useCallback(() => {
    setActive(null);
    setShowGate(false);
    setPending(null);
  }, []);

  const onGateVerified = useCallback((updatedProfile: BusinessProfile) => {
    setProfile(updatedProfile);
    setShowGate(false);
    if (pendingPayload) { setActive(pendingPayload); setPending(null); }
  }, [pendingPayload]);

  return (
    <SDKContext.Provider value={{ launch, close, profile, profileLoading }}>
      {children}

      {/* ── Sovereign Gate Modal ── */}
      {showGate && createPortal(
        <SovereignOverlay>
          <BusinessProfileGate
            hostAppId={HOST_APP_ID}
            onVerified={onGateVerified}
            onAbort={() => { setShowGate(false); setPending(null); }}
          />
        </SovereignOverlay>,
        document.body,
      )}

      {/* ── Active SDK Function Modal ── */}
      {active && createPortal(
        <SovereignOverlay>
          <ActiveModal payload={active} onClose={close} />
        </SovereignOverlay>,
        document.body,
      )}
    </SDKContext.Provider>
  );
}

// ── Sovereign Overlay wrapper (non-dismissible) ───────────────────────────────
function SovereignOverlay({ children }: { children: React.ReactNode }) {
  // Swallow all click events — the overlay cannot be dismissed by clicking outside
  return (
    <div className="pff-sdk-overlay" onClick={e => e.stopPropagation()}>
      <div className="pff-sdk-panel" onClick={e => e.stopPropagation()}>
        <div className="pff-sdk-strip">
          <span className="pff-sdk-strip__brand">♛ PFF-TRUST · Sovereign SDK</span>
          <span className="pff-sdk-strip__lock">🔒 BSSS PROTOCOL ACTIVE</span>
        </div>
        <div className="pff-sdk-content">{children}</div>
      </div>
    </div>
  );
}

// ── Route payload → correct modal ─────────────────────────────────────────────
function ActiveModal({ payload, onClose }: { payload: SDKPayload; onClose: () => void }) {

  switch (payload.fn) {
    case "BAS":       return <F01_BAS       cfg={payload.cfg} />;
    case "ZFOE":      return <F02_ZFOE      cfg={payload.cfg} />;
    case "BIH":       return <F03_BIH       cfg={payload.cfg} />;
    case "BLS":       return <F04_BLS       cfg={payload.cfg} />;
    case "BLIDE":     return <F05_BLIDE     cfg={payload.cfg} />;
    case "ZFPS":      return <F06_ZFPS      cfg={payload.cfg} />;
    case "YES_CALL":  return <F07_YES       cfg={payload.cfg} />;
    case "SSA":       return <F08_SSA       cfg={payload.cfg} />;
    case "BEPWG":     return <F09_BEPWG     cfg={payload.cfg} />;
    case "LBAS":      return <F10_LBAS      cfg={payload.cfg} />;
    case "UNWP":      return <F11_UNWP      cfg={payload.cfg} />;
    case "KYA":       return <F12_KYA       cfg={payload.cfg} />;
    case "KINGMAKER": return <F13_KINGMAKER cfg={payload.cfg} />;
    default:          return <div style={{color:"#fff",padding:"2rem"}}>Unknown function. <button onClick={onClose}>Close</button></div>;
  }
}

