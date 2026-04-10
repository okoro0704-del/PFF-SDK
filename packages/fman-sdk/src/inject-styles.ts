// ─── @bsss/fman-sdk · Auto-CSS Injector ──────────────────────────────────────
// Injects sovereign.css into the host app's <head> on first import.
// Uses Vite's ?inline import to bundle CSS as a string — zero extra files needed.
import css from "./sovereign.css?inline";

let injected = false;

export function injectSovereignStyles(): void {
  if (injected || typeof document === "undefined") return;
  const existing = document.getElementById("pff-sdk-styles");
  if (existing) { injected = true; return; }
  const style = document.createElement("style");
  style.id = "pff-sdk-styles";
  style.textContent = css;
  document.head.appendChild(style);
  injected = true;
}

// Auto-inject on import
injectSovereignStyles();

