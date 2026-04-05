// ─── PFF-TRUST · Unified SDK Dashboard — 13-Function Sovereign Launch Grid ────
import { usePFFTrust } from "./UnifiedSDKProvider";

interface FnCard {
  id:    string;
  label: string;
  desc:  string;
  icon:  string;
  badge: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  launch: (l: (p: any) => void) => void;
}

const HOST = "bank-portal";

const FN_CARDS: FnCard[] = [
  {
    id:"BAS", label:"Biometric Account Setup", icon:"🖐️", badge:"F01",
    desc:"10-finger enrollment + NIBSS BVN/NIN verification. Creates a Tier-1 or Tier-3 biometric account.",
    launch: l => l({ fn:"BAS", cfg:{ tier:1, hostAppId:HOST, onSuccess:(r:unknown)=>console.log(r), onAbort:()=>{} } }),
  },
  {
    id:"ZFOE", label:"Zero-Friction Account Opening", icon:"🏦", badge:"F02",
    desc:"Opens a new bank account in under 60 seconds via NIBSS real-time verification. No paperwork.",
    launch: l => l({ fn:"ZFOE", cfg:{ hostAppId:HOST, onSuccess:(r:unknown)=>console.log(r), onAbort:()=>{} } }),
  },
  {
    id:"BIH", label:"Biometric Identity Harvest", icon:"🛡️", badge:"F03",
    desc:"Triple-gate identity capture: fingerprint + liveness challenge + NIN cross-reference via NIBSS.",
    launch: l => l({ fn:"BIH", cfg:{ hostAppId:HOST, sessionRef:`BIH-${Date.now()}`, onSuccess:(r:unknown)=>console.log(r), onAbort:()=>{} } }),
  },
  {
    id:"BLS", label:"Biometric Liquidity Sweep", icon:"💸", badge:"F04",
    desc:"Biometric-gated fund sweep. NIBSS settlement in real-time. Signed token returned to host app.",
    launch: l => l({ fn:"BLS", cfg:{ hostAppId:HOST, accountRef:"ACC-DEMO-001", amountMinor:5000000, onSuccess:(r:unknown)=>console.log(r), onAbort:()=>{} } }),
  },
  {
    id:"BLIDE", label:"Biometric Face Pay", icon:"😊", badge:"F05",
    desc:"Authorize payments with facial recognition alone. 1:1 biometric match — no PIN, no card.",
    launch: l => l({ fn:"BLIDE", cfg:{ hostAppId:HOST, ref:`BLIDE-${Date.now()}`, amount:25000, beneficiary:"Access Bank - 0123456789", onSuccess:(r:unknown)=>console.log(r), onAbort:()=>{} } }),
  },
  {
    id:"ZFPS", label:"Zero-Friction Provisioning", icon:"🚀", badge:"F06",
    desc:"Provisions 6 NIBSS and CBN services in sequence: BVN link, NIN sync, KYC upgrade, NUBAN, mandate, limits.",
    launch: l => l({ fn:"ZFPS", cfg:{ hostAppId:HOST, onSuccess:(r:unknown)=>console.log(r), onAbort:()=>{} } }),
  },
  {
    id:"YES_CALL", label:"YES CALL — Biometric Gate", icon:"✅", badge:"F07",
    desc:"Biometric transaction authorization. Host app receives only a BSSS-signed SUCCESS_TOKEN. Raw biometric never exposed.",
    launch: l => l({ fn:"YES_CALL", cfg:{ hostAppId:HOST, ref:`YES-${Date.now()}`, amount:50000, beneficiary:"GTBank - 0987654321", narration:"Demo YES CALL", onSuccess:(r:unknown)=>console.log(r), onAbort:()=>{} } }),
  },
  {
    id:"SSA", label:"Secured Saving Account / AJO", icon:"🔒", badge:"F08",
    desc:"31-day biometric lock. Ajo-Signature fingerprint. 50% early-break penalty + 10-minute cooling-off rule.",
    launch: l => l({ fn:"SSA", cfg:{ hostAppId:HOST, targetAmount:100000, daysSinceStart:0, onSuccess:(r:unknown)=>console.log(r), onAbort:()=>{} } }),
  },
  {
    id:"BEPWG", label:"Proximity Withdrawal Gate", icon:"📍", badge:"F09",
    desc:"GPS-gated withdrawals. Verifies you are within the approved radius of the terminal before biometric auth.",
    launch: l => l({ fn:"BEPWG", cfg:{ hostAppId:HOST, ref:`BEPWG-${Date.now()}`, amountMinor:2000000, maxDistanceMeters:100, onSuccess:(r:unknown)=>console.log(r), onAbort:()=>{} } }),
  },
  {
    id:"LBAS", label:"Live Biometric Auth System", icon:"🎭", badge:"F10",
    desc:"Anti-spoofing dual-gate: randomized liveness challenge (7 types) + 6-digit TOTP. 30-second time limit.",
    launch: l => l({ fn:"LBAS", cfg:{ hostAppId:HOST, challengeRef:`LBAS-${Date.now()}`, onSuccess:(r:unknown)=>console.log(r), onAbort:()=>{} } }),
  },
  {
    id:"UNWP", label:"Unbanked Withdrawal Protocol", icon:"💵", badge:"F11",
    desc:"Cognitive TOTP (no app required) + offline POS ledger reconciliation + biometric release for unbanked users.",
    launch: l => l({ fn:"UNWP", cfg:{ hostAppId:HOST, ref:`UNWP-${Date.now()}`, amountMinor:500000, onSuccess:(r:unknown)=>console.log(r), onAbort:()=>{} } }),
  },
  {
    id:"KYA", label:"Know Your Agent", icon:"🤝", badge:"F12",
    desc:"Master Agent chain of trust management. Sub-Agent enrollment with biometric activation and CBN-compliant accountability.",
    launch: l => l({ fn:"KYA", cfg:{ hostAppId:HOST, masterAgentId:"MA-001", onSuccess:(r:unknown)=>console.log(r), onAbort:()=>{} } }),
  },
  {
    id:"KINGMAKER", label:"Sovereign Vault Partner", icon:"♛", badge:"F13",
    desc:"Apply to join the Kingmaker pool. Receive 31-day sovereign AJO deposits and earn a SOVEREIGN_RESTRICTED liquidity rating.",
    launch: l => l({ fn:"KINGMAKER", cfg:{ hostAppId:HOST, onSuccess:(r:unknown)=>console.log(r), onAbort:()=>{} } }),
  },
];

export function UnifiedSDKDashboard({ onBack }: { onBack: () => void }) {
  const { launch, profile, profileLoading } = usePFFTrust();

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem 5rem" }}>
      {/* Header */}
      <button className="btn btn--ghost btn--sm" onClick={onBack} style={{ marginBottom: "1.5rem" }}>← Dashboard</button>
      <span className="badge badge--gold" style={{ fontSize:"0.6rem",letterSpacing:"0.18em",marginBottom:"0.75rem",display:"block" }}>♛ UNIVERSAL BIOMETRIC SDK · 13 SOVEREIGN FUNCTIONS</span>
      <h2 className="serif" style={{ fontSize:"clamp(1.6rem,3vw,2.4rem)", marginBottom:"0.4rem" }}>
        Unified Sovereign <span style={{color:"var(--gold-bright)"}}>SDK</span>
      </h2>
      <p style={{ color:"var(--text-muted)", fontSize:"0.85rem", lineHeight:1.7, marginBottom:"1.5rem", maxWidth:640 }}>
        The F-Man Sovereign SDK force-injects its UI over any connected host application. All 13 functions require a <strong style={{color:"var(--gold-bright)"}}>Verified Business Profile</strong> and execute inside a sovereign overlay that cannot be dismissed by the host app.
      </p>

      {/* Profile Status Banner */}
      <div style={{
        display:"flex", alignItems:"center", gap:"0.85rem",
        background: profileLoading ? "rgba(255,255,255,0.03)" : profile?.verified ? "rgba(34,197,94,0.07)" : "rgba(239,68,68,0.07)",
        border:`1px solid ${profileLoading?"rgba(255,255,255,0.08)":profile?.verified?"rgba(34,197,94,0.25)":"rgba(239,68,68,0.25)"}`,
        borderRadius:"10px", padding:"0.85rem 1.25rem", marginBottom:"2rem",
      }}>
        <span style={{fontSize:"1.5rem"}}>{profileLoading?"⏳":profile?.verified?"♛":"🔒"}</span>
        <div>
          <div style={{fontWeight:700,fontSize:"0.88rem",color:profileLoading?"rgba(255,255,255,0.5)":profile?.verified?"#22c55e":"#ef4444"}}>
            {profileLoading ? "Checking business profile…" : profile?.verified ? `Verified Business — ${profile.businessName ?? "SDK Host"} · All 13 functions unlocked` : `Business Profile ${profile?.status ?? "NOT REGISTERED"} — Functions locked until verified`}
          </div>
          {!profileLoading&&!profile?.verified&&<div style={{fontSize:"0.74rem",color:"rgba(255,255,255,0.4)",marginTop:"0.2rem"}}>Click any function below to start the verification flow (takes ~2 minutes)</div>}
        </div>
      </div>

      {/* Function Grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:"1rem" }}>
        {FN_CARDS.map(card => (
          <div key={card.id} className="pillar-card" style={{
            padding:"1.25rem", display:"flex", flexDirection:"column", gap:"0.65rem",
            cursor:"pointer", transition:"transform 0.18s, border-color 0.18s",
          }}
            onClick={() => card.launch(launch)}
            onMouseEnter={e=>(e.currentTarget.style.transform="translateY(-2px)")}
            onMouseLeave={e=>(e.currentTarget.style.transform="translateY(0)")}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span style={{fontSize:"1.8rem"}}>{card.icon}</span>
              <span style={{
                background:"rgba(201,168,76,0.12)",border:"1px solid rgba(201,168,76,0.25)",
                borderRadius:"4px",padding:"0.15rem 0.5rem",fontSize:"0.65rem",fontWeight:700,
                color:"#c9a84c",letterSpacing:"0.1em",
              }}>{card.badge}</span>
            </div>
            <div>
              <div style={{fontWeight:700,fontSize:"0.92rem",color:"#fff",marginBottom:"0.3rem"}}>{card.label}</div>
              <div style={{fontSize:"0.76rem",color:"rgba(255,255,255,0.45)",lineHeight:1.65}}>{card.desc}</div>
            </div>
            <button className="btn btn--gold btn--sm" style={{marginTop:"auto",alignSelf:"flex-start"}}>
              {profile?.verified ? "⚡ Launch →" : "🔒 Launch (requires verification)"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

