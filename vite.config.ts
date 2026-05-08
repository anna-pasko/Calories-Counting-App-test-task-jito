import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      // Proxy Open Food Facts to dodge browser CORS in dev.
      // Production needs an equivalent host-level rewrite (see vercel.json).
      "/off-api": {
        target: "https://world.openfoodfacts.org",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/off-api/, ""),
      },
    },
  },
});
