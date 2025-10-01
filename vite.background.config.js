import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    external: ["chrome"],
    minify: true,
    rollupOptions: {
      input: "background.js",
      output: {
        entryFileNames: "background.bundle.js",
        format: "iife",
        name: "BackgroundBundle", // required for IIFE
      },
    },
    emptyOutDir: false,
    target: "esnext",
  },
});
