import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  base: process.env.DEPLOY_BASE || "/",
  plugins: [
    react(),
    visualizer({
      filename: "dist/stats.html",
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    chunkSizeWarningLimit: 500, // Reduced for better chunking
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ["console.log", "console.info"],
        dead_code: true,
        unused: true,
      },
      mangle: {
        safari10: true,
      },
    },
    rollupOptions: {
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false,
      },
      output: {
        manualChunks: (id) => {
          // React and React-DOM
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/")
          ) {
            return "react-vendor";
          }
          // Three.js - separate chunk for tree-shaking
          if (id.includes("node_modules/three/")) {
            return "three-vendor";
          }
          // GSAP - separate chunk
          if (
            id.includes("node_modules/gsap/") ||
            id.includes("node_modules/@gsap/")
          ) {
            return "gsap-vendor";
          }
          // UI libraries
          if (
            id.includes("node_modules/lucide-react/") ||
            id.includes("node_modules/typewriter-effect/")
          ) {
            return "ui-vendor";
          }
          // Helmet
          if (id.includes("node_modules/@dr.pogodin/react-helmet/")) {
            return "helmet-vendor";
          }
          // Large vendor libraries
          if (id.includes("node_modules/")) {
            return "vendor";
          }
        },
        // Optimize asset file names for caching
        assetFileNames: (assetInfo) => {
          if (
            /\.(png|jpe?g|webp|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)
          ) {
            return `images/[name]-[hash][extname]`;
          }
          if (/\.(css)$/i.test(assetInfo.name)) {
            return `css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: "js/[name]-[hash].js",
        entryFileNames: "js/[name]-[hash].js",
      },
    },
  },
  preview: {
    port: 4173,
    host: true,
  },
});
