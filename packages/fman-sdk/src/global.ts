// ─── @bsss/fman-sdk · Global IIFE Entry ──────────────────────────────────────
// This file is the entry point for the CDN/script-tag build.
// <script src="global.iife.js"></script>
// window.PFFTrust.init({ apiKey, hostAppId })
// window.PFFTrust.launch({ fn: 'YES_CALL', cfg: { ... } })

import React              from "react";
import ReactDOM           from "react-dom/client";
import { UnifiedSDKProvider } from "./UnifiedSDKProvider";
import { initSDK, type SDKInitConfig } from "./config";
import type { SDKPayload } from "./types";
import "./inject-styles";

// The launch fn is registered by UnifiedSDKProvider on mount via window.__PFF_TRUST__
// global.ts mounts the provider into a hidden div and bridges it to window.PFFTrust

let mounted = false;

function mountProvider() {
  if (mounted || typeof document === "undefined") return;
  mounted = true;
  const el = document.createElement("div");
  el.id = "__pff-sdk-root__";
  document.body.appendChild(el);
  ReactDOM.createRoot(el).render(
    React.createElement(React.StrictMode, null,
      React.createElement(UnifiedSDKProvider, null)
    )
  );
}

const PFFTrust = {
  /**
   * Initialise the SDK. Call once before any launch().
   * @example
   * PFFTrust.init({ apiKey: 'sk_sovereign_XXX', hostAppId: 'my-bank' })
   */
  init(cfg: SDKInitConfig): void {
    initSDK(cfg);
    mountProvider();
  },

  /**
   * Launch any of the 13 sovereign biometric functions.
   * The sovereign overlay force-injects over the host app at z-index 99999.
   * @example
   * PFFTrust.launch({ fn: 'YES_CALL', cfg: { amount: 50000, ... } })
   */
  launch(payload: SDKPayload): void {
    // UnifiedSDKProvider registers window.__PFF_TRUST__.launch on mount
    const sdk = (window as unknown as Record<string, unknown>)["PFFTrust"] as
      { launch?: (p: SDKPayload) => void } | undefined;
    if (sdk?.launch) {
      sdk.launch(payload);
    } else {
      console.warn("[PFFTrust] SDK not ready. Call PFFTrust.init() first.");
    }
  },
};

// Expose on window
(window as unknown as Record<string, unknown>)["PFFTrust"] = PFFTrust;

export { PFFTrust };

