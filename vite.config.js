// ============================================================================
//  Vite config — pure SPA build for Hostinger static hosting
//  (removed @lovable.dev/vite-tanstack-config which generated an SSR bundle
//   for Cloudflare Workers / Netlify — unusable on a static host)
// ============================================================================
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

export default defineConfig({
  base: "/",
  plugins: [
    // Must come before react() — generates src/routeTree.gen.ts from src/routes/
    TanStackRouterVite({
      routesDirectory: "./src/routes",
      generatedRouteTree: "./src/routeTree.gen.ts",
      quoteStyle: "double",
    }),
    react(),
    tailwindcss(),
    // Resolves the "@/*" path alias defined in tsconfig.json → ./src/*
    tsconfigPaths(),
  ],
  build: {
    outDir: "dist",
    // Split vendor chunks for better caching on Hostinger
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          router: ["@tanstack/react-router"],
          ui: ["lucide-react"],
        },
      },
    },
  },
  // Ensure the dev server also behaves like a SPA (fallback to index.html)
  server: {
    port: 5173,
  },
});
