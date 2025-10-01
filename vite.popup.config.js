import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    external: ["chrome"],

    minify: true,
    rollupOptions: {
      input: "popup.js",
      output: {
        entryFileNames: "popup.bundle.js",
        format: "iife",
        name: "PopupBundle",
      },
    },
    emptyOutDir: false,
    target: "esnext",
  },
});
