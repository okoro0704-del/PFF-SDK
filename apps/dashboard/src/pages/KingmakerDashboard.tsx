import { useState, useEffect, useCallback } from "react";

const API = "/api";
type Tab = "overview" | "partners" | "vaults" | "audit";

interface LmrMetrics {
  tvlFormatted: string;
  floatIncomeEstimate: string;
  activeVaultCount: number;
  flippedToday: number;
  pendingFlipCount: number;
  partnerBreakdown: PartnerStat[];
  legacyBankBreakdown: LegacyBank[];
  dailyVaultCreation: DailyPoint[];
}
interface PartnerStat {
  bankCode: string; bankName: string;
  totalVaultsCreated: number; totalTvlMinor: string;
  avgFlipLatencyMs: number; apiUptimePct: string | number;
  totalFlipFailures: number;
}
interface LegacyBank { bankCode: string | null; bankName: string | null; vaultCount: number; tvlMinor: string; }
interface DailyPoint { date: string; amountMinor: string; }
interface Partner {
  id: string; bankCode: string; bankName: string; status: string;
  contactEmail: string; contactName: string; cbnLicenceRef: string;
  adminNote: string | null; appliedAt: string; approvedAt: string | null;
  totalVaultsCreated: number; totalVaultsFlipped: number;
  totalFlipFailures: number; apiUptimePct: string | number;
  avgFlipLatencyMs: number;
}
interface Vault {
  id: string; ajoAccountRef: string; partnerBankName: string; partnerBankCode: string;
  vaultStatus: string; targetAmountMinor: string; legacyBankName: string | null;
  createdAt: string; flipScheduledFor: string | null; flippedAt: string | null;
  withdrawnAt: string | null; flipLatencyMs: number | null;
}
interface AuditLog {
  id: string; eventType: string; vaultRef: string | null; ajoAccountRef: string | null;
  partnerBankCode: string | null; amountMinor: string | null; latencyMs: number | null; createdAt: string;
}

const STATUS_COLOR: Record<string, string> = {
  APPROVED: "#22c55e", PENDING: "#f59e0b", SUSPENDED: "#ef4444", REVOKED: "#6b7280",
};
const VAULT_COLOR: Record<string, string> = {
  SOVEREIGN_RESTRICTED: "#f59e0b", SOVEREIGN_ACTIVE: "#22c55e", WITHDRAWN: "#6b7280",
};
const EVENT_ICON: Record<string, string> = {
  PARTNER_APPLIED: "📋", PARTNER_APPROVED: "✅", PARTNER_SUSPENDED: "🚫",
  VAULT_CREATED: "🏦", FLIP_SENT: "📤", FLIP_SUCCESS: "✅", FLIP_FAILED: "❌",
  SDK_WITHDRAWAL_RELEASED: "💸",
};

function fmt(minor: string | null): string {
  if (!minor) return "—";
  return `₦${(Number(minor) / 100).toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
}

export function KingmakerDashboard({ onBack }: { onBack: () => void }) {
  const [tab, setTab]           = useState<Tab>("overview");
  const [metrics, setMetrics]   = useState<LmrMetrics | null>(null);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [vaults, setVaults]     = useState<Vault[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [vaultFilter, setVaultFilter] = useState("ALL");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [flipRunning, setFlipRunning] = useState(false);
  const [flipMsg, setFlipMsg]   = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      if (tab === "overview") {
        const r = await fetch(`${API}/v1/kingmaker/metrics`);
        setMetrics(await r.json());
      } else if (tab === "partners") {
        const r = await fetch(`${API}/v1/kingmaker/partners`);
        const d = await r.json();
        setPartners(d.partners ?? []);
      } else if (tab === "vaults") {
        const qs = vaultFilter === "ALL" ? "" : `&status=${vaultFilter}`;
        const r = await fetch(`${API}/v1/kingmaker/vaults?limit=100${qs}`);
        const d = await r.json();
        setVaults(d.vaults ?? []);
      } else {
        const r = await fetch(`${API}/v1/kingmaker/audit?limit=200`);
        const d = await r.json();
        setAuditLogs(d.logs ?? []);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Load failed");
    } finally { setLoading(false); }
  }, [tab, vaultFilter]);

  useEffect(() => { load(); }, [load]);

  const triggerFlip = async () => {
    setFlipRunning(true); setFlipMsg(null);
    try {
      await fetch(`${API}/v1/kingmaker/scheduler/trigger-flip`, { method: "PATCH" });
      setFlipMsg("Flip cycle complete. Refresh vaults to see updates.");
      load();
    } catch { setFlipMsg("Flip trigger failed."); }
    finally { setFlipRunning(false); }
  };

  return (
    <div style={{ padding: "0 0 5rem" }}>
      {/* Header */}
      <div style={{ background: "rgba(201,168,76,0.06)", borderBottom: "1px solid var(--gold-border)", padding: "1.5rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <span className="badge badge--gold" style={{ fontSize: "0.6rem", letterSpacing: "0.15em", marginBottom: "0.4rem", display: "block" }}>♛ KINGMAKER — SOVEREIGN VAULT PROTOCOL</span>
          <h2 className="serif" style={{ margin: 0, fontSize: "1.6rem" }}>Liquidity Migration Rate Dashboard</h2>
          <p style={{ margin: "0.25rem 0 0", fontSize: "0.8rem", color: "var(--text-dim)" }}>Real-time sovereign capital routing · Partner Bank Performance · Day-31 Flip Monitor</p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <button className="btn btn--outline btn--sm" onClick={triggerFlip} disabled={flipRunning}>
            {flipRunning ? "Running…" : "⚡ Manual Flip"}
          </button>
          <button className="btn btn--ghost btn--sm" onClick={onBack}>← Admin</button>
        </div>
      </div>
      {flipMsg && <div style={{ background: "rgba(34,197,94,0.1)", border: "1px solid #22c55e", padding: "0.5rem 2rem", fontSize: "0.82rem", color: "#22c55e" }}>{flipMsg}</div>}

      {/* Tabs */}
      <div style={{ borderBottom: "1px solid var(--gold-border)", padding: "0 2rem", display: "flex", gap: "0.25rem" }}>
        {(["overview","partners","vaults","audit"] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`btn btn--sm ${tab === t ? "btn--gold" : "btn--ghost"}`}
            style={{ borderRadius: 0, borderBottom: tab === t ? "2px solid var(--gold-bright)" : "2px solid transparent", textTransform: "capitalize", fontWeight: tab === t ? 700 : 400 }}>
            {t === "overview" ? "📊 Overview" : t === "partners" ? "🏦 Partners" : t === "vaults" ? "🔒 Vaults" : "📋 Audit Log"}
          </button>
        ))}
      </div>

      <div className="container" style={{ padding: "2rem" }}>
        {loading && <p style={{ color: "var(--text-dim)" }}>Loading…</p>}
        {error   && <p style={{ color: "#ef4444" }}>⚠ {error}</p>}
        {!loading && !error && (
          <>
            {tab === "overview" && metrics && <OverviewTab m={metrics} />}
            {tab === "partners" && <PartnersTab partners={partners} reload={load} />}
            {tab === "vaults"   && <VaultsTab vaults={vaults} filter={vaultFilter} setFilter={setVaultFilter} />}
            {tab === "audit"    && <AuditTab logs={auditLogs} />}
          </>
        )}
      </div>
    </div>
  );
}

// ── Overview Tab ──────────────────────────────────────────────────────────────
function OverviewTab({ m }: { m: LmrMetrics }) {
  const kpis = [
    { label: "Total Value Locked", value: m.tvlFormatted, icon: "🏦", gold: true },
    { label: "Est. Float Income", value: m.floatIncomeEstimate, icon: "📈", gold: false },
    { label: "Active Vaults (Locked)", value: m.activeVaultCount.toLocaleString(), icon: "🔒", gold: false },
    { label: "Flipped Today", value: m.flippedToday.toLocaleString(), icon: "✅", gold: true },
    { label: "Pending Flip (≤24h)", value: m.pendingFlipCount.toLocaleString(), icon: "⏳", gold: false },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* KPI strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: "1rem" }}>
        {kpis.map(k => (
          <div key={k.label} className="pillar-card" style={{ padding: "1.25rem 1rem", textAlign: "center" }}>
            <div style={{ fontSize: "1.6rem", marginBottom: "0.25rem" }}>{k.icon}</div>
            <div style={{ fontSize: "1.4rem", fontWeight: 700, color: k.gold ? "var(--gold-bright)" : "var(--text-primary)" }}>{k.value}</div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", letterSpacing: "0.08em", marginTop: "0.2rem" }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Partner Breakdown */}
      <div className="pillar-card">
        <h4 style={{ marginTop: 0, color: "var(--gold-bright)" }}>♛ Approved Partner Performance</h4>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--gold-border)", color: "var(--text-dim)", textAlign: "left" }}>
              <th style={{ padding: "0.4rem 0.5rem" }}>Bank</th>
              <th style={{ padding: "0.4rem 0.5rem" }}>Vaults</th>
              <th style={{ padding: "0.4rem 0.5rem" }}>TVL</th>
              <th style={{ padding: "0.4rem 0.5rem" }}>Avg Flip</th>
              <th style={{ padding: "0.4rem 0.5rem" }}>Uptime</th>
              <th style={{ padding: "0.4rem 0.5rem" }}>Failures</th>
            </tr>
          </thead>
          <tbody>
            {m.partnerBreakdown.map(p => (
              <tr key={p.bankCode} style={{ borderBottom: "1px solid rgba(201,168,76,0.08)" }}>
                <td style={{ padding: "0.5rem" }}>{p.bankName}</td>
                <td style={{ padding: "0.5rem" }}>{p.totalVaultsCreated.toLocaleString()}</td>
                <td style={{ padding: "0.5rem", color: "var(--gold-bright)" }}>{fmt(p.totalTvlMinor)}</td>
                <td style={{ padding: "0.5rem" }}>{p.avgFlipLatencyMs}ms</td>
                <td style={{ padding: "0.5rem", color: Number(p.apiUptimePct) > 99 ? "#22c55e" : "#f59e0b" }}>{p.apiUptimePct}%</td>
                <td style={{ padding: "0.5rem", color: p.totalFlipFailures > 0 ? "#ef4444" : "#22c55e" }}>{p.totalFlipFailures}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legacy Bank Migration */}
      <div className="pillar-card">
        <h4 style={{ marginTop: 0, color: "var(--gold-bright)" }}>🏛️ Capital Migrating FROM Legacy Banks</h4>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
          {m.legacyBankBreakdown.map((b, i) => (
            <div key={i} style={{ background: "rgba(201,168,76,0.07)", border: "1px solid var(--gold-border)", borderRadius: "8px", padding: "0.75rem 1rem", minWidth: 160 }}>
              <div style={{ fontWeight: 600, marginBottom: "0.2rem" }}>{b.bankName ?? "Unknown"}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>{b.vaultCount} vaults · {fmt(b.tvlMinor)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Partners Tab ──────────────────────────────────────────────────────────────
function PartnersTab({ partners, reload }: { partners: Partner[]; reload: () => void }) {
  const [approving, setApproving] = useState<string | null>(null);
  const [suspending, setSuspending] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const approve = async (bankCode: string) => {
    setApproving(bankCode);
    const r = await fetch(`${API}/v1/kingmaker/partners/${bankCode}/approve`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ adminNote: "Approved via Admin Dashboard" }) });
    const d = await r.json();
    setMsg(d.sovereignLicenseKey ? `✅ Approved. License Key: ${d.sovereignLicenseKey}` : d.message ?? "Done");
    setApproving(null);
    reload();
  };
  const suspend = async (bankCode: string) => {
    setSuspending(bankCode);
    await fetch(`${API}/v1/kingmaker/partners/${bankCode}/suspend`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reason: "Suspended via Admin Dashboard" }) });
    setMsg("Partner suspended.");
    setSuspending(null);
    reload();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {msg && <div style={{ background: "rgba(201,168,76,0.1)", border: "1px solid var(--gold-border)", padding: "0.6rem 1rem", borderRadius: "6px", fontSize: "0.82rem", color: "var(--gold-bright)", wordBreak: "break-all" }}>{msg}</div>}
      {partners.length === 0 && <p style={{ color: "var(--text-dim)" }}>No partners found.</p>}
      {partners.map(p => (
        <div key={p.id} className="pillar-card" style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
            <div>
              <span style={{ fontWeight: 700, fontSize: "1.05rem" }}>{p.bankName}</span>
              <span style={{ marginLeft: "0.75rem", fontSize: "0.75rem", color: "var(--text-dim)" }}>Code: {p.bankCode}</span>
            </div>
            <span style={{ background: `${STATUS_COLOR[p.status]}20`, color: STATUS_COLOR[p.status], border: `1px solid ${STATUS_COLOR[p.status]}40`, borderRadius: "4px", padding: "0.15rem 0.6rem", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em" }}>{p.status}</span>
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-dim)", display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            <span>📧 {p.contactEmail}</span>
            <span>👤 {p.contactName}</span>
            <span>📜 CBN: {p.cbnLicenceRef}</span>
            <span>📅 Applied: {new Date(p.appliedAt).toLocaleDateString()}</span>
            {p.approvedAt && <span>✅ Approved: {new Date(p.approvedAt).toLocaleDateString()}</span>}
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "flex", gap: "1.25rem", flexWrap: "wrap" }}>
            <span>🏦 {p.totalVaultsCreated} vaults created</span>
            <span>✅ {p.totalVaultsFlipped} flipped</span>
            <span>❌ {p.totalFlipFailures} failures</span>
            <span>📶 {p.apiUptimePct}% uptime</span>
            <span>⚡ {p.avgFlipLatencyMs}ms avg flip</span>
          </div>
          {p.adminNote && <div style={{ fontSize: "0.78rem", color: "var(--text-dim)", fontStyle: "italic" }}>Note: {p.adminNote}</div>}
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}>
            {p.status === "PENDING" && <button className="btn btn--gold btn--sm" onClick={() => approve(p.bankCode)} disabled={approving === p.bankCode}>{approving === p.bankCode ? "Approving…" : "✅ Approve"}</button>}
            {p.status === "APPROVED" && <button className="btn btn--outline btn--sm" onClick={() => suspend(p.bankCode)} disabled={suspending === p.bankCode} style={{ borderColor: "#ef4444", color: "#ef4444" }}>{suspending === p.bankCode ? "Suspending…" : "🚫 Suspend"}</button>}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Vaults Tab ────────────────────────────────────────────────────────────────
function VaultsTab({ vaults, filter, setFilter }: { vaults: Vault[]; filter: string; setFilter: (f: string) => void }) {
  const filters = ["ALL", "SOVEREIGN_RESTRICTED", "SOVEREIGN_ACTIVE", "WITHDRAWN"];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {filters.map(f => (
          <button key={f} className={`btn btn--sm ${filter === f ? "btn--gold" : "btn--ghost"}`} onClick={() => setFilter(f)}>
            {f === "ALL" ? "All" : f === "SOVEREIGN_RESTRICTED" ? "🔒 Restricted" : f === "SOVEREIGN_ACTIVE" ? "✅ Active" : "💸 Withdrawn"}
          </button>
        ))}
      </div>
      {vaults.length === 0 && <p style={{ color: "var(--text-dim)" }}>No vaults found.</p>}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--gold-border)", color: "var(--text-dim)", textAlign: "left" }}>
              <th style={{ padding: "0.4rem 0.5rem" }}>AJO Ref</th>
              <th style={{ padding: "0.4rem 0.5rem" }}>Partner Bank</th>
              <th style={{ padding: "0.4rem 0.5rem" }}>Status</th>
              <th style={{ padding: "0.4rem 0.5rem" }}>Target</th>
              <th style={{ padding: "0.4rem 0.5rem" }}>Legacy Bank</th>
              <th style={{ padding: "0.4rem 0.5rem" }}>Created</th>
              <th style={{ padding: "0.4rem 0.5rem" }}>Flip Due</th>
              <th style={{ padding: "0.4rem 0.5rem" }}>Flip Latency</th>
            </tr>
          </thead>
          <tbody>
            {vaults.map(v => (
              <tr key={v.id} style={{ borderBottom: "1px solid rgba(201,168,76,0.07)" }}>
                <td style={{ padding: "0.5rem", fontFamily: "monospace", fontSize: "0.72rem" }}>{v.ajoAccountRef}</td>
                <td style={{ padding: "0.5rem" }}>{v.partnerBankName}</td>
                <td style={{ padding: "0.5rem" }}>
                  <span style={{ color: VAULT_COLOR[v.vaultStatus] ?? "#aaa", fontWeight: 600, fontSize: "0.7rem" }}>{v.vaultStatus.replace("SOVEREIGN_","")}</span>
                </td>
                <td style={{ padding: "0.5rem", color: "var(--gold-bright)" }}>{fmt(v.targetAmountMinor)}</td>
                <td style={{ padding: "0.5rem", color: "var(--text-dim)" }}>{v.legacyBankName ?? "—"}</td>
                <td style={{ padding: "0.5rem", color: "var(--text-dim)" }}>{new Date(v.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: "0.5rem", color: "var(--text-dim)" }}>{v.flipScheduledFor ? new Date(v.flipScheduledFor).toLocaleDateString() : "—"}</td>
                <td style={{ padding: "0.5rem", color: v.flipLatencyMs ? "#22c55e" : "var(--text-dim)" }}>{v.flipLatencyMs ? `${v.flipLatencyMs}ms` : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Audit Tab ─────────────────────────────────────────────────────────────────
function AuditTab({ logs }: { logs: AuditLog[] }) {
  return (
    <div>
      {logs.length === 0 && <p style={{ color: "var(--text-dim)" }}>No audit events.</p>}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--gold-border)", color: "var(--text-dim)", textAlign: "left" }}>
            <th style={{ padding: "0.4rem 0.5rem" }}>Event</th>
            <th style={{ padding: "0.4rem 0.5rem" }}>Partner</th>
            <th style={{ padding: "0.4rem 0.5rem" }}>AJO Ref</th>
            <th style={{ padding: "0.4rem 0.5rem" }}>Amount</th>
            <th style={{ padding: "0.4rem 0.5rem" }}>Latency</th>
            <th style={{ padding: "0.4rem 0.5rem" }}>Time</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(l => (
            <tr key={l.id} style={{ borderBottom: "1px solid rgba(201,168,76,0.06)" }}>
              <td style={{ padding: "0.5rem" }}>{EVENT_ICON[l.eventType] ?? "•"} <span style={{ fontWeight: 600 }}>{l.eventType}</span></td>
              <td style={{ padding: "0.5rem", color: "var(--text-dim)" }}>{l.partnerBankCode ?? "—"}</td>
              <td style={{ padding: "0.5rem", fontFamily: "monospace", fontSize: "0.7rem", color: "var(--text-dim)" }}>{l.ajoAccountRef ?? "—"}</td>
              <td style={{ padding: "0.5rem", color: "var(--gold-bright)" }}>{fmt(l.amountMinor)}</td>
              <td style={{ padding: "0.5rem", color: "var(--text-dim)" }}>{l.latencyMs ? `${l.latencyMs}ms` : "—"}</td>
              <td style={{ padding: "0.5rem", color: "var(--text-dim)", fontSize: "0.72rem" }}>{new Date(l.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

