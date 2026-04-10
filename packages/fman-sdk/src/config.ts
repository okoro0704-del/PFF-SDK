// ─── @bsss/fman-sdk · Runtime Configuration ──────────────────────────────────

export interface SDKInitConfig {
  /** Your Sovereign API Key — issued by PFF-TRUST partner portal */
  apiKey:      string;
  /** Unique identifier for your host application */
  hostAppId:   string;
  /** PFF-TRUST API base URL. Defaults to production. */
  apiUrl?:     string;
  /** 'sandbox' | 'production'. Defaults to 'production'. */
  env?:        "sandbox" | "production";
  /** Called when business profile is verified and SDK is unlocked */
  onVerified?: (profile: { businessName: string; status: string }) => void;
  /** Called when SDK is blocked (e.g., suspended licence) */
  onBlocked?:  (reason: string) => void;
}

interface ResolvedConfig {
  apiKey:    string;
  hostAppId: string;
  apiUrl:    string;
  env:       "sandbox" | "production";
}

const PROD_URL    = "https://api.pff-trust.ng";
const SANDBOX_URL = "https://sandbox-api.pff-trust.ng";

let _config: ResolvedConfig = {
  apiKey:    "",
  hostAppId: "default",
  apiUrl:    PROD_URL,
  env:       "production",
};

/** Call once at app startup before any launch() */
export function initSDK(cfg: SDKInitConfig): void {
  _config = {
    apiKey:    cfg.apiKey,
    hostAppId: cfg.hostAppId,
    apiUrl:    cfg.apiUrl ?? (cfg.env === "sandbox" ? SANDBOX_URL : PROD_URL),
    env:       cfg.env ?? "production",
  };
}

export function getApiUrl():    string { return _config.apiUrl;    }
export function getHostAppId(): string { return _config.hostAppId; }
export function getApiKey():    string { return _config.apiKey;    }
export function getConfig():    ResolvedConfig { return { ..._config }; }

