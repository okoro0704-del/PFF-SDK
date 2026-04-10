// ─── @bsss/fman-sdk · UnifiedSDKProvider ─────────────────────────────────────
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "./inject-styles";
import type { SDKPayload, BusinessProfile } from "./types";
import { BusinessProfileGate } from "./BusinessProfileGate";
import { getApiUrl, getHostAppId } from "./config";

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

interface SDKContextValue {
  launch:         (payload: SDKPayload) => void;
  close:          () => void;
  profile:        BusinessProfile | null;
  profileLoading: boolean;
}
const SDKContext = createContext<SDKContextValue | null>(null);

export function usePFFTrust() {
  const ctx = useContext(SDKContext);
  if (!ctx) throw new Error("usePFFTrust must be used inside <UnifiedSDKProvider>");
  return ctx;
}

export function UnifiedSDKProvider({ children }: { children?: React.ReactNode }) {
  const [active,   setActive]   = useState<SDKPayload | null>(null);
  const [showGate, setShowGate] = useState(false);
  const [pending,  setPending]  = useState<SDKPayload | null>(null);
  const [profile,  setProfile]  = useState<BusinessProfile | null>(null);
  const [profileLoading, setLoading] = useState(true);

  // Silently check verification status on mount
  useEffect(() => {
    const hostAppId = getHostAppId();
    fetch(`${getApiUrl()}/v1/sdk/profile/check?hostAppId=${hostAppId}`)
      .then(r => r.json())
      .then((d: BusinessProfile) => setProfile(d))
      .catch(() => setProfile({ status: "NOT_REGISTERED", verified: false }))
      .finally(() => setLoading(false));
  }, []);

  const launch = useCallback((payload: SDKPayload) => {
    if (!profile?.verified) { setPending(payload); setShowGate(true); return; }
    setActive(payload);
  }, [profile]);

  const close = useCallback(() => {
    setActive(null); setShowGate(false); setPending(null);
  }, []);

  // Register window.PFFTrust.launch for non-React host apps
  useEffect(() => {
    (window as unknown as Record<string, unknown>)["PFFTrust"] = { launch };
    return () => { delete (window as unknown as Record<string, unknown>)["PFFTrust"]; };
  }, [launch]);

  const onGateVerified = useCallback((p: BusinessProfile) => {
    setProfile(p); setShowGate(false);
    if (pending) { setActive(pending); setPending(null); }
  }, [pending]);

  return (
    <SDKContext.Provider value={{ launch, close, profile, profileLoading }}>
      {children}

      {showGate && createPortal(
        <SovereignOverlay>
          <BusinessProfileGate
            hostAppId={getHostAppId()}
            onVerified={onGateVerified}
            onAbort={() => { setShowGate(false); setPending(null); }}
          />
        </SovereignOverlay>,
        document.body,
      )}

      {active && createPortal(
        <SovereignOverlay>
          <ActiveModal payload={active} onClose={close} />
        </SovereignOverlay>,
        document.body,
      )}
    </SDKContext.Provider>
  );
}

function SovereignOverlay({ children }: { children: React.ReactNode }) {
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
    default:          return <div style={{color:"#fff",padding:"2rem"}}>Unknown function.<button onClick={onClose}>Close</button></div>;
  }
}

