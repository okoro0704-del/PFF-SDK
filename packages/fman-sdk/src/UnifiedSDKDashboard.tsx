// ─── @bsss/fman-sdk · UnifiedSDKDashboard ────────────────────────────────────
// 13-function sovereign launch grid — self-contained, zero host CSS deps.
import { usePFFTrust } from "./UnifiedSDKProvider";

const HOST = typeof window !== "undefined"
  ? (window as unknown as Record<string,unknown>)["__PFF_HOST_APP_ID__"] as string ?? "sdk-host"
  : "sdk-host";

const FN_CARDS = [
  { id:"BAS",       label:"Biometric Account Setup",        icon:"🖐️", badge:"F01", desc:"10-finger NIBSS enrollment. Creates Tier-1/3 biometric account.",                   launch:(l:ReturnType<typeof usePFFTrust>["launch"]) => l({fn:"BAS",       cfg:{hostAppId:HOST,tier:1,          onSuccess:(r:unknown)=>console.log(r),onAbort:()=>{}}}) },
  { id:"ZFOE",      label:"Zero-Friction Account Opening",  icon:"🏦", badge:"F02", desc:"Opens bank account in 60s via NIBSS. No paperwork.",                                 launch:(l:ReturnType<typeof usePFFTrust>["launch"]) => l({fn:"ZFOE",      cfg:{hostAppId:HOST,                onSuccess:(r:unknown)=>console.log(r),onAbort:()=>{}}}) },
  { id:"BIH",       label:"Biometric Identity Harvest",     icon:"🛡️", badge:"F03", desc:"Triple-gate: fingerprint + liveness + NIN via NIBSS.",                              launch:(l:ReturnType<typeof usePFFTrust>["launch"]) => l({fn:"BIH",       cfg:{hostAppId:HOST,sessionRef:`BIH-${Date.now()}`,onSuccess:(r:unknown)=>console.log(r),onAbort:()=>{}}}) },
  { id:"BLS",       label:"Biometric Liquidity Sweep",      icon:"💸", badge:"F04", desc:"Biometric-gated fund sweep. NIBSS real-time settlement.",                           launch:(l:ReturnType<typeof usePFFTrust>["launch"]) => l({fn:"BLS",       cfg:{hostAppId:HOST,accountRef:"ACC-DEMO",amountMinor:5000000,onSuccess:(r:unknown)=>console.log(r),onAbort:()=>{}}}) },
  { id:"BLIDE",     label:"Biometric Face Pay",             icon:"😊", badge:"F05", desc:"1:1 facial recognition payment. No PIN required.",                                  launch:(l:ReturnType<typeof usePFFTrust>["launch"]) => l({fn:"BLIDE",     cfg:{hostAppId:HOST,ref:`BLIDE-${Date.now()}`,amount:25000,beneficiary:"Demo Bank",onSuccess:(r:unknown)=>console.log(r),onAbort:()=>{}}}) },
  { id:"ZFPS",      label:"Zero-Friction Provisioning",     icon:"🚀", badge:"F06", desc:"Sequences 6 NIBSS/CBN services: BVN, NIN, KYC, NUBAN, mandate, limits.",           launch:(l:ReturnType<typeof usePFFTrust>["launch"]) => l({fn:"ZFPS",      cfg:{hostAppId:HOST,                onSuccess:(r:unknown)=>console.log(r),onAbort:()=>{}}}) },
  { id:"YES_CALL",  label:"YES CALL — Biometric Gate",      icon:"✅", badge:"F07", desc:"Biometric transaction auth. Returns BSSS-signed SUCCESS_TOKEN only.",               launch:(l:ReturnType<typeof usePFFTrust>["launch"]) => l({fn:"YES_CALL",  cfg:{hostAppId:HOST,ref:`YES-${Date.now()}`,amount:50000,beneficiary:"Demo",onSuccess:(r:unknown)=>console.log(r),onAbort:()=>{}}}) },
  { id:"SSA",       label:"Secured Saving Account / AJO",   icon:"🔒", badge:"F08", desc:"31-day biometric lock. Ajo-Signature. 50% early-break penalty.",                   launch:(l:ReturnType<typeof usePFFTrust>["launch"]) => l({fn:"SSA",       cfg:{hostAppId:HOST,targetAmount:100000,onSuccess:(r:unknown)=>console.log(r),onAbort:()=>{}}}) },
  { id:"BEPWG",     label:"Proximity Withdrawal Gate",      icon:"📍", badge:"F09", desc:"GPS-verified withdrawal within approved terminal radius.",                           launch:(l:ReturnType<typeof usePFFTrust>["launch"]) => l({fn:"BEPWG",     cfg:{hostAppId:HOST,ref:`BEPWG-${Date.now()}`,amountMinor:2000000,onSuccess:(r:unknown)=>console.log(r),onAbort:()=>{}}}) },
  { id:"LBAS",      label:"Live Biometric Auth System",     icon:"🎭", badge:"F10", desc:"Anti-spoofing: randomised liveness challenge (7 types) + TOTP. 30s limit.",        launch:(l:ReturnType<typeof usePFFTrust>["launch"]) => l({fn:"LBAS",      cfg:{hostAppId:HOST,challengeRef:`LBAS-${Date.now()}`,onSuccess:(r:unknown)=>console.log(r),onAbort:()=>{}}}) },
  { id:"UNWP",      label:"Unbanked Withdrawal Protocol",   icon:"💵", badge:"F11", desc:"Cognitive TOTP + offline POS ledger + biometric release for unbanked.",             launch:(l:ReturnType<typeof usePFFTrust>["launch"]) => l({fn:"UNWP",      cfg:{hostAppId:HOST,ref:`UNWP-${Date.now()}`,amountMinor:500000,onSuccess:(r:unknown)=>console.log(r),onAbort:()=>{}}}) },
  { id:"KYA",       label:"Know Your Agent",                icon:"🤝", badge:"F12", desc:"Master Agent chain of trust. Sub-Agent enrollment + CBN accountability.",          launch:(l:ReturnType<typeof usePFFTrust>["launch"]) => l({fn:"KYA",       cfg:{hostAppId:HOST,masterAgentId:"MA-001",onSuccess:(r:unknown)=>console.log(r),onAbort:()=>{}}}) },
  { id:"KINGMAKER", label:"Sovereign Vault Partner",        icon:"♛",  badge:"F13", desc:"Apply to receive 31-day sovereign AJO deposits. Kingmaker Partner pool.",          launch:(l:ReturnType<typeof usePFFTrust>["launch"]) => l({fn:"KINGMAKER", cfg:{hostAppId:HOST,                onSuccess:(r:unknown)=>console.log(r),onAbort:()=>{}}}) },
];

export function UnifiedSDKDashboard({ onBack }: { onBack?: () => void }) {
  const { launch, profile, profileLoading } = usePFFTrust();

  return (
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"2rem 1.5rem 5rem" }}>
      {onBack && (
        <button onClick={onBack} style={{ marginBottom:"1.5rem", background:"transparent", border:"1px solid rgba(255,255,255,0.15)", color:"rgba(255,255,255,0.6)", borderRadius:"8px", padding:"0.4rem 1rem", cursor:"pointer", fontSize:"0.8rem" }}>
          ← Back
        </button>
      )}

      <div style={{ fontSize:"0.62rem", fontWeight:700, letterSpacing:"0.18em", color:"rgba(201,168,76,0.7)", marginBottom:"0.6rem", textTransform:"uppercase" }}>
        ♛ UNIVERSAL BIOMETRIC SDK · 13 SOVEREIGN FUNCTIONS
      </div>
      <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:"clamp(1.6rem,3vw,2.4rem)", fontWeight:800, color:"#fff", margin:"0 0 0.4rem" }}>
        Unified Sovereign <span style={{ color:"#c9a84c" }}>SDK</span>
      </h2>
      <p style={{ color:"rgba(255,255,255,0.45)", fontSize:"0.85rem", lineHeight:1.7, marginBottom:"1.5rem", maxWidth:640 }}>
        Click any function to launch the sovereign overlay. A <strong style={{ color:"#c9a84c" }}>Verified Business Profile</strong> is required — the gate auto-fires on first launch.
      </p>

      {/* Profile Status Banner */}
      <div style={{ display:"flex", alignItems:"center", gap:"0.85rem", background: profile?.verified ? "rgba(34,197,94,0.07)" : "rgba(239,68,68,0.07)", border:`1px solid ${profile?.verified ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`, borderRadius:"10px", padding:"0.85rem 1.25rem", marginBottom:"2rem" }}>
        <span style={{ fontSize:"1.5rem" }}>{profileLoading ? "⏳" : profile?.verified ? "♛" : "🔒"}</span>
        <div>
          <div style={{ fontWeight:700, fontSize:"0.88rem", color: profile?.verified ? "#22c55e" : "#ef4444" }}>
            {profileLoading ? "Checking business profile…" : profile?.verified ? `♛ Verified — ${profile.businessName ?? "SDK Host"} · All 13 functions unlocked` : "Business Profile not verified — click any function to begin"}
          </div>
        </div>
      </div>

      {/* 13-Function Grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:"1rem" }}>
        {FN_CARDS.map(card => (
          <div key={card.id}
            onClick={() => card.launch(launch)}
            style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"14px", padding:"1.25rem", display:"flex", flexDirection:"column", gap:"0.65rem", cursor:"pointer", transition:"transform 0.18s, border-color 0.18s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform="translateY(-2px)"; (e.currentTarget as HTMLDivElement).style.borderColor="rgba(201,168,76,0.3)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform="translateY(0)";   (e.currentTarget as HTMLDivElement).style.borderColor="rgba(255,255,255,0.08)"; }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <span style={{ fontSize:"1.8rem" }}>{card.icon}</span>
              <span style={{ background:"rgba(201,168,76,0.12)", border:"1px solid rgba(201,168,76,0.25)", borderRadius:"4px", padding:"0.15rem 0.5rem", fontSize:"0.65rem", fontWeight:700, color:"#c9a84c", letterSpacing:"0.1em" }}>{card.badge}</span>
            </div>
            <div>
              <div style={{ fontWeight:700, fontSize:"0.92rem", color:"#fff", marginBottom:"0.3rem" }}>{card.label}</div>
              <div style={{ fontSize:"0.76rem", color:"rgba(255,255,255,0.45)", lineHeight:1.65 }}>{card.desc}</div>
            </div>
            <button style={{ marginTop:"auto", alignSelf:"flex-start", background:"rgba(201,168,76,0.12)", border:"1px solid rgba(201,168,76,0.3)", color:"#c9a84c", borderRadius:"8px", padding:"0.35rem 0.9rem", fontSize:"0.75rem", fontWeight:700, cursor:"pointer" }}>
              {profile?.verified ? "⚡ Launch →" : "🔒 Launch"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

