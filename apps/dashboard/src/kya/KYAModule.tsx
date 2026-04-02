// ─── PFF-TRUST · KYA Module — Context + Portal ───────────────────────────────
// Force-injects into any host app Settings · Manages Agent Chain of Trust

import { createContext, useContext, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import type { MasterProfile, SubAgent } from "./types";
import { SubAgentEnrollment } from "./SubAgentEnrollment";
import "./kya.css";

// ── Demo Master Agent (production: fetched from Supabase on BVN-linked auth) ──
const DEMO_MASTER: MasterProfile = {
  agentId:     "MA-001",
  displayName: "Emmanuel Okoro",
  bvnMasked:   "2237***5891",
  tier:        "MASTER",
  subAgents: [
    {
      ssId: "SS-MA001-0001", bvnMasked: "3312***7804", phoneMasked: "0803***6789",
      displayName: "Chukwuemeka Eze",
      linkedAt: Date.now() - 86_400_000 * 5, status: "ACTIVE",
      bioActivated: true, terminalId: "POS-LGA-007",
    },
    {
      ssId: "SS-MA001-0002", bvnMasked: "4418***2293", phoneMasked: "0706***4421",
      displayName: "Fatima Abdullahi",
      linkedAt: Date.now() - 86_400_000 * 2, status: "PENDING_BIO",
      bioActivated: false, terminalId: undefined,
    },
  ],
};

// ── Context ───────────────────────────────────────────────────────────────────
interface KYACtx {
  profile:     MasterProfile;
  openEnroll:  () => void;
  forceKYA:    (reason: string) => void;
  addSubAgent: (a: SubAgent)   => void;
}
const Ctx = createContext<KYACtx>({
  profile: DEMO_MASTER, openEnroll: () => {}, forceKYA: () => {}, addSubAgent: () => {},
});
export const useKYA = () => useContext(Ctx);

// ── Provider ──────────────────────────────────────────────────────────────────
export function KYAProvider({ children }: { children: ReactNode }) {
  const [profile,      setProfile]   = useState<MasterProfile>(DEMO_MASTER);
  const [enrollOpen,   setEnroll]    = useState(false);
  const [forceReason,  setReason]    = useState<string | null>(null);

  const openEnroll = () => { setReason(null); setEnroll(true); };
  const forceKYA   = (r: string) => { setReason(r); setEnroll(true); };
  const dismiss    = () => { setEnroll(false); setReason(null); };

  const addSubAgent = (a: SubAgent) => {
    setProfile(p => ({ ...p, subAgents: [...p.subAgents, a] }));
    dismiss();
  };

  return (
    <Ctx.Provider value={{ profile, openEnroll, forceKYA, addSubAgent }}>
      {children}

      {enrollOpen && createPortal(
        <div className="kya-overlay">
          <div className="kya-panel">
            <div className="kya-strip">
              🔗 F-MAN KYA MODULE · KNOW YOUR AGENT · CHAIN OF TRUST · SOVEREIGN INJECTION
            </div>

            {/* Force-Override Banner */}
            {forceReason && (
              <div style={{
                background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.3)",
                borderRadius:8, padding:"0.7rem 1rem",
                margin:"1.4rem 0 0", fontSize:"0.78rem", color:"#ef4444", lineHeight:1.6,
              }}>
                ⚠️ <strong>Override Active:</strong> {forceReason}
              </div>
            )}

            <SubAgentEnrollment
              masterProfile={profile}
              onComplete={addSubAgent}
              onCancel={dismiss}
            />
          </div>
        </div>,
        document.body,
      )}
    </Ctx.Provider>
  );
}

