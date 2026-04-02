// ─── PFF-TRUST · Universal Biometric SDK — Context + Portal ──────────────────
// F-Man Life OS Middleware · Force-Injects sovereign UI via React Portal

import { createContext, useContext, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import type { SDKPayload, SDKResult } from "./types";
import { BASModal }      from "./BASModal";
import { BiometricGate } from "./BiometricGate";
import { SSAModal }      from "./SSAModal";
import "./sdk.css";

// ── Context ───────────────────────────────────────────────────────────────────
interface SDKCtx { launch: (p: SDKPayload) => void; }
const Ctx = createContext<SDKCtx>({ launch: () => {} });
export const useBiometricSDK = () => useContext(Ctx);

// ── Provider ──────────────────────────────────────────────────────────────────
export function BiometricSDKProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<SDKPayload | null>(null);

  const dismiss = () => setActive(null);

  /** Wrap caller callbacks so the modal auto-dismisses after completion */
  const wrap = (p: SDKPayload): SDKPayload => {
    const ok  = (r: SDKResult) => { dismiss(); p.cfg.onSuccess(r); };
    const off = () => { dismiss(); p.cfg.onAbort?.(); };
    if (p.fn === "BAS")      return { fn: "BAS",      cfg: { ...p.cfg, onSuccess: ok, onAbort: off } };
    if (p.fn === "YES_CALL") return { fn: "YES_CALL",  cfg: { ...p.cfg, onSuccess: ok, onAbort: off } };
    return                          { fn: "SSA",       cfg: { ...p.cfg, onSuccess: ok, onAbort: off } };
  };

  const launch = (p: SDKPayload) => setActive(wrap(p));

  return (
    <Ctx.Provider value={{ launch }}>
      {children}

      {active && createPortal(
        <div className="sdk-overlay">
          <div className="sdk-panel">
            {/* ── Sovereign UI override strip (non-dismissible) ── */}
            <div className="sdk-mandatory-strip">
              🔒 F-MAN BIOMETRIC GATE · SOVEREIGN UI OVERRIDE · NON-DISMISSIBLE
            </div>

            <div style={{ paddingTop: "1.1rem" }}>
              {active.fn === "BAS"      && <BASModal      cfg={active.cfg} />}
              {active.fn === "YES_CALL" && <BiometricGate cfg={active.cfg} />}
              {active.fn === "SSA"      && <SSAModal      cfg={active.cfg} />}
            </div>
          </div>
        </div>,
        document.body,
      )}
    </Ctx.Provider>
  );
}

