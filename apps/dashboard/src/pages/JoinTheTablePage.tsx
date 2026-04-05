import { useState } from "react";

const API = "/api";

interface FormState {
  bankCode: string;
  bankName: string;
  apiEndpoint: string;
  contactEmail: string;
  contactName: string;
  cbnLicenceRef: string;
}

const INITIAL: FormState = {
  bankCode: "", bankName: "", apiEndpoint: "https://",
  contactEmail: "", contactName: "", cbnLicenceRef: "",
};

type Stage = "form" | "submitting" | "success" | "error";

export function JoinTheTablePage({ onBack }: { onBack: () => void }) {
  const [form, setForm]   = useState<FormState>(INITIAL);
  const [stage, setStage] = useState<Stage>("form");
  const [result, setResult] = useState<{ partnerRef?: string; message?: string; error?: string } | null>(null);

  const set = (k: keyof FormState, v: string) => setForm(p => ({ ...p, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStage("submitting");
    try {
      const r = await fetch(`${API}/v1/kingmaker/partners/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const d = await r.json();
      if (r.ok) { setResult(d); setStage("success"); }
      else       { setResult({ error: d.message ?? "Submission failed" }); setStage("error"); }
    } catch (err: unknown) {
      setResult({ error: err instanceof Error ? err.message : "Network error" });
      setStage("error");
    }
  };

  if (stage === "success") return (
    <div style={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "3rem 2rem" }}>
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>♛</div>
      <h2 className="serif" style={{ color: "var(--gold-bright)", marginBottom: "0.75rem" }}>Application Received</h2>
      <p style={{ maxWidth: 480, color: "var(--text-muted)", lineHeight: 1.7, marginBottom: "0.5rem" }}>
        {result?.message ?? "Your application has been submitted to the PFF-TRUST Sovereign Vault review panel."}
      </p>
      {result?.partnerRef && (
        <p style={{ fontFamily: "monospace", fontSize: "0.82rem", color: "var(--gold-bright)", background: "rgba(201,168,76,0.08)", border: "1px solid var(--gold-border)", borderRadius: "6px", padding: "0.5rem 1rem", marginTop: "0.75rem" }}>
          Reference: {result.partnerRef}
        </p>
      )}
      <p style={{ color: "var(--text-dim)", fontSize: "0.82rem", marginTop: "1rem" }}>
        You will be contacted at <strong>{form.contactEmail}</strong> within 48 hours with the outcome of your review.
      </p>
      <button className="btn btn--gold" style={{ marginTop: "1.5rem" }} onClick={onBack}>← Back to Portal</button>
    </div>
  );

  const inputStyle: React.CSSProperties = {
    background: "rgba(201,168,76,0.05)", border: "1px solid var(--gold-border)",
    borderRadius: "6px", padding: "0.65rem 0.9rem", color: "var(--text-primary)",
    fontSize: "0.9rem", width: "100%", boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase",
    color: "var(--gold-bright)", marginBottom: "0.4rem", display: "block",
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "2.5rem 2rem 5rem" }}>
      <button className="btn btn--ghost btn--sm" onClick={onBack} style={{ marginBottom: "1.5rem" }}>← Back</button>

      <span className="badge badge--gold" style={{ fontSize: "0.62rem", letterSpacing: "0.18em", marginBottom: "1rem", display: "block" }}>♛ SOVEREIGN VAULT PROTOCOL</span>
      <h2 className="serif" style={{ fontSize: "clamp(1.6rem,3vw,2.5rem)", marginBottom: "0.5rem" }}>
        Join the <span style={{ color: "var(--gold-bright)" }}>Table</span>
      </h2>
      <p style={{ color: "var(--text-muted)", lineHeight: 1.7, marginBottom: "2rem", maxWidth: 560 }}>
        Apply to become a <strong style={{ color: "var(--gold-bright)" }}>Sovereign Vault Partner</strong>. Approved banks receive 31-day locked AJO deposits, 
        routed via the PFF-TRUST SDK biometric gate. Capital is SOVEREIGN_RESTRICTED by default 
        and only released on Day 31 via the F-Man flip protocol.
      </p>

      {/* What you get */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
        {[
          { icon: "🔒", title: "Locked Deposits", desc: "31-day sovereign capital inflow from the AJO network" },
          { icon: "📶", title: "LMR Rating", desc: "Public uptime + flip latency performance score on the dashboard" },
          { icon: "♛", title: "Sovereign License", desc: "CBN-recognised F-Man sovereign API access key" },
          { icon: "🤝", title: "SDK Integration", desc: "Listed in the ZFOE & SSA bank-selection modals" },
        ].map(c => (
          <div key={c.title} className="pillar-card" style={{ padding: "1rem", textAlign: "center" }}>
            <div style={{ fontSize: "1.4rem", marginBottom: "0.35rem" }}>{c.icon}</div>
            <div style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: "0.2rem" }}>{c.title}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>{c.desc}</div>
          </div>
        ))}
      </div>

      {stage === "error" && result?.error && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid #ef4444", borderRadius: "6px", padding: "0.65rem 1rem", color: "#ef4444", fontSize: "0.84rem", marginBottom: "1.5rem" }}>
          ⚠ {result.error}
        </div>
      )}

      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>Bank Name *</label>
            <input style={inputStyle} required value={form.bankName} onChange={e => set("bankName", e.target.value)} placeholder="e.g. Zenith Bank Plc" />
          </div>
          <div>
            <label style={labelStyle}>CBN Sort Code *</label>
            <input style={inputStyle} required value={form.bankCode} onChange={e => set("bankCode", e.target.value)} placeholder="e.g. 057" maxLength={6} />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Sovereign API Endpoint *</label>
          <input style={inputStyle} required type="url" value={form.apiEndpoint} onChange={e => set("apiEndpoint", e.target.value)} placeholder="https://api.yourbank.ng/pff-sovereign" />
          <p style={{ fontSize: "0.72rem", color: "var(--text-dim)", marginTop: "0.3rem" }}>This endpoint must implement the three PFF-TRUST vault methods: <code>vault/create</code>, <code>vault/flip-active</code>, <code>vault/withdraw</code>.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>Technical Contact Name *</label>
            <input style={inputStyle} required value={form.contactName} onChange={e => set("contactName", e.target.value)} placeholder="Full name of API owner" />
          </div>
          <div>
            <label style={labelStyle}>Contact Email *</label>
            <input style={inputStyle} required type="email" value={form.contactEmail} onChange={e => set("contactEmail", e.target.value)} placeholder="api@yourbank.ng" />
          </div>
        </div>

        <div>
          <label style={labelStyle}>CBN Agent Banking Licence Reference *</label>
          <input style={inputStyle} required value={form.cbnLicenceRef} onChange={e => set("cbnLicenceRef", e.target.value)} placeholder="e.g. CBN/ABL/2024/001" minLength={6} />
        </div>

        {/* Disclaimer */}
        <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid var(--gold-border)", borderRadius: "8px", padding: "1rem 1.25rem", fontSize: "0.78rem", color: "var(--text-dim)", lineHeight: 1.7 }}>
          <strong style={{ color: "var(--gold-bright)", display: "block", marginBottom: "0.4rem" }}>⚖️ Sovereign Partner Declaration</strong>
          By submitting this application you confirm that your institution: (1) holds a valid CBN Agent Banking licence, 
          (2) can implement the F-Man Sovereign Vault API specification, (3) agrees to the 31-day SOVEREIGN_RESTRICTED lock 
          protocol and will only flip account status via the PFF-TRUST Day-31 authorisation token, (4) accepts that all 
          biometric authorisations are governed by the BSSS (Biometric System Security Standard) and no raw biometric 
          data shall be stored or logged by your CBS.
        </div>

        <button className="btn btn--gold" type="submit" disabled={stage === "submitting"} style={{ padding: "0.85rem 2rem", fontSize: "1rem", alignSelf: "flex-start" }}>
          {stage === "submitting" ? "Submitting…" : "♛ Apply for Sovereign Partnership"}
        </button>
      </form>
    </div>
  );
}

