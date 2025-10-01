import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    external: ["chrome"],
    minify: true,
    rollupOptions: {
      input: "content.js",
      output: {
        entryFileNames: "content.bundle.js",
        format: "iife",
        name: "ContentBundle", // required for IIFE
      },
    },
    emptyOutDir: false,
    target: "esnext",
  },
});
