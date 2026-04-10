// ─── @bsss/fman-sdk · Global IIFE Build (CDN / Script Tag) ──────────────────
// Bundles React + ReactDOM + SDK into one self-contained file.
// Usage: <script src="fman-sdk/dist/global.iife.js"></script>
//        window.PFFTrust.launch({ fn: 'YES_CALL', cfg: { ... } })
import { defineConfig } from "vite";
import react            from "@vitejs/plugin-react";
import { resolve }      from "path";

export default defineConfig({
  plugins: [react()],

  build: {
    lib: {
      entry:    resolve(__dirname, "src/global.ts"),
      name:     "PFFTrust",
      formats:  ["iife"],
      fileName: () => "global.iife.js",
    },
    rollupOptions: {
      // IIFE bundles everything — React included — for zero-dependency CDN use
      external: [],
    },
    cssCodeSplit: false,
    sourcemap:    false,
    outDir:       "dist",
    emptyOutDir:  false,  // lib build already created dist/
  },
});

