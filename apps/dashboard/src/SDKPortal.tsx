// ─── PFF-TRUST · SDK Developer Portal ────────────────────────────────────────
// This is what lives at pff-trust.netlify.app
// A bank's developer visits this page to explore, test, and integrate the SDK.

import { useState } from "react";
import { UnifiedSDKProvider, UnifiedSDKDashboard, usePFFTrust } from "./unified-sdk";
import "./index.css";

export function SDKPortal() {
  return (
    <UnifiedSDKProvider>
      <SDKPortalInner />
    </UnifiedSDKProvider>
  );
}

function SDKPortalInner() {
  const { profile } = usePFFTrust();
  const [showCode, setShowCode] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-deep)", color: "#fff", fontFamily: "Inter, sans-serif" }}>

      {/* ── Sovereign Top Bar ── */}
      <div style={{
        background: "linear-gradient(90deg, rgba(201,168,76,0.12) 0%, rgba(201,168,76,0.04) 100%)",
        borderBottom: "1px solid rgba(201,168,76,0.2)",
        padding: "0.65rem 2rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100,
        backdropFilter: "blur(12px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <span style={{ fontSize: "1.3rem" }}>♛</span>
          <div>
            <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#c9a84c", letterSpacing: "0.12em" }}>
              PFF-TRUST · F-MAN SOVEREIGN SDK
            </div>
            <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em" }}>
              v1.0.0 · BIOMETRIC IDENTITY & AJO SETTLEMENT LAYER
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <span style={{
            fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em",
            color: profile?.verified ? "#22c55e" : "#f59e0b",
            background: profile?.verified ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)",
            border: `1px solid ${profile?.verified ? "rgba(34,197,94,0.3)" : "rgba(245,158,11,0.3)"}`,
            borderRadius: "4px", padding: "0.2rem 0.6rem",
          }}>
            {profile?.verified ? "♛ VERIFIED" : "⏳ PENDING VERIFICATION"}
          </span>
          <button
            onClick={() => setShowCode(s => !s)}
            style={{
              background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.3)",
              color: "#c9a84c", borderRadius: "6px", padding: "0.3rem 0.85rem",
              fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", letterSpacing: "0.06em",
            }}>
            {showCode ? "Hide Code" : "</> Quick Start"}
          </button>
        </div>
      </div>

      {/* ── Quick Start Code Panel ── */}
      {showCode && (
        <div style={{
          background: "#0a0d08", borderBottom: "1px solid rgba(201,168,76,0.15)",
          padding: "1.5rem 2rem",
        }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <div style={{ fontSize: "0.7rem", color: "#c9a84c", fontWeight: 700, letterSpacing: "0.12em", marginBottom: "0.75rem" }}>
              QUICK INTEGRATION · 3 LINES
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {[
                {
                  label: "1 · Install",
                  code: `npm install @bsss/fman-sdk`,
                },
                {
                  label: "2 · Wrap your app",
                  code: `import { UnifiedSDKProvider } from '@bsss/fman-sdk';\n\n<UnifiedSDKProvider apiKey="sk_sovereign_XXX">\n  <YourApp />\n</UnifiedSDKProvider>`,
                },
                {
                  label: "3 · Launch any function",
                  code: `const { launch } = usePFFTrust();\n\nlaunch({\n  fn: 'YES_CALL',\n  cfg: {\n    amount: 50000,\n    beneficiary: 'Zenith Bank — 0123456789',\n    onSuccess: (r) => save(r.successToken),\n  },\n});`,
                },
                {
                  label: "Global API (any framework)",
                  code: `// Works in Vue, Angular, vanilla JS\nwindow.PFFTrust.launch({\n  fn: 'BAS',\n  cfg: { tier: 1, hostAppId: 'my-bank' },\n});`,
                },
              ].map(s => (
                <div key={s.label} style={{
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "8px", padding: "0.85rem 1rem",
                }}>
                  <div style={{ fontSize: "0.65rem", color: "#c9a84c", fontWeight: 700, letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
                    {s.label}
                  </div>
                  <pre style={{ margin: 0, fontSize: "0.74rem", color: "#a8f5a2", lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: "'JetBrains Mono', monospace" }}>
                    {s.code}
                  </pre>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "1rem", fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.7 }}>
              📖 Full docs in <code style={{ color: "#c9a84c" }}>README.md</code> ·
              🔑 Sovereign API Key issued on CBN licence verification ·
              💬 <a href="mailto:api@pff-trust.ng" style={{ color: "#c9a84c" }}>api@pff-trust.ng</a>
            </div>
          </div>
        </div>
      )}

      {/* ── Hero ── */}
      <div style={{
        textAlign: "center", padding: "3rem 2rem 1.5rem",
        background: "linear-gradient(180deg, rgba(201,168,76,0.05) 0%, transparent 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}>
        <div style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.2em", color: "rgba(201,168,76,0.7)", marginBottom: "0.75rem" }}>
          CBN-COMPLIANT · NIBSS-INTEGRATED · BSSS PROTOCOL
        </div>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 800,
          color: "#fff", lineHeight: 1.15, margin: "0 0 0.75rem",
        }}>
          The Biometric Identity &<br />
          <span style={{ color: "#c9a84c" }}>Ajo Settlement Layer</span>
        </h1>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.9rem", maxWidth: 560, margin: "0 auto 1.5rem", lineHeight: 1.75 }}>
          One SDK. 13 sovereign biometric functions. Force-inject a CBN-compliant
          biometric UI over any host application — bank portal, POS, or fintech app.
          Raw biometric data <strong style={{ color: "#fff" }}>never</strong> leaves the device.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          {["🛡️ BSSS Protocol", "🏦 NIBSS BVN/NIN", "💰 Ajo 31-Day Lock", "📍 Proximity Gate", "🎭 Liveness Check", "♛ Sovereign Vault"].map(tag => (
            <span key={tag} style={{
              fontSize: "0.68rem", color: "rgba(255,255,255,0.5)",
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "20px", padding: "0.25rem 0.75rem",
            }}>{tag}</span>
          ))}
        </div>
      </div>

      {/* ── 13-Function SDK Grid ── */}
      <UnifiedSDKDashboard onBack={() => {}} />

      {/* ── Footer ── */}
      <div style={{
        borderTop: "1px solid rgba(201,168,76,0.15)",
        padding: "1.5rem 2rem", textAlign: "center",
        background: "rgba(0,0,0,0.3)",
      }}>
        <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)", lineHeight: 2 }}>
          ♛ <strong style={{ color: "#c9a84c" }}>PFF-TRUST</strong> · F-Man Sovereign SDK v1.0.0 ·
          Proprietary — All Rights Reserved · CBN Agent Banking Compliant<br />
          <a href="mailto:api@pff-trust.ng" style={{ color: "rgba(201,168,76,0.6)", textDecoration: "none" }}>api@pff-trust.ng</a>
          {" · "}
          <a href="mailto:legal@pff-trust.ng" style={{ color: "rgba(201,168,76,0.6)", textDecoration: "none" }}>legal@pff-trust.ng</a>
        </div>
      </div>

    </div>
  );
}

