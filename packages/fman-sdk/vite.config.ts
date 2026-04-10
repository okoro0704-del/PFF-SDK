// ─── @bsss/fman-sdk · Library Build (ESM + CJS) ──────────────────────────────
import { defineConfig } from "vite";
import react            from "@vitejs/plugin-react";
import dts              from "vite-plugin-dts";
import { resolve }      from "path";

export default defineConfig({
  plugins: [
    react(),
    dts({
      include:      ["src"],
      outDir:       "dist",
      rollupTypes:  true,
      tsconfigPath: "./tsconfig.json",
    }),
  ],

  build: {
    lib: {
      entry:    resolve(__dirname, "src/index.ts"),
      name:     "FManSDK",
      formats:  ["es", "cjs"],
      fileName: (fmt) => `index.${fmt === "es" ? "js" : "cjs"}`,
    },
    rollupOptions: {
      // React is a peer dep — never bundle it in the library build
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        globals: {
          "react":             "React",
          "react-dom":         "ReactDOM",
          "react/jsx-runtime": "ReactJSXRuntime",
        },
      },
    },
    cssCodeSplit: false,
    sourcemap:    true,
    outDir:       "dist",
    emptyOutDir:  true,
  },
});

