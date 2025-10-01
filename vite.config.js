import { defineConfig } from "vite";

export default defineConfig({
  root: ".",
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        background: "background.js",
        content: "content.js",
        popup: "popup.js",
      },
      output: {
        entryFileNames: "[name].bundle.js", // will output background.bundle.js and content.bundle.js
        format: "es", // suitable for Chrome Extensions
      },
    },
    emptyOutDir: true,
    target: "esnext",
    minify: true,
  },
  publicDir: "./public",
});
