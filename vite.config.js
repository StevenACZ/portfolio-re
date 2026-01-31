import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { visualizer } from "rollup-plugin-visualizer";

function ignoreNuxtRequests() {
  return {
    name: "ignore-nuxt-requests",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith("/_nuxt/")) {
          res.statusCode = 404;
          res.end("Not found");
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  base: process.env.DEPLOY_BASE || "/",
  plugins: [
    ignoreNuxtRequests(),
    vue(),
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
          // Vue
          if (
            id.includes("node_modules/vue/") ||
            id.includes("node_modules/@vue/")
          ) {
            return "vue-vendor";
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
            id.includes("node_modules/lucide-vue-next/") ||
            id.includes("node_modules/typed.js/")
          ) {
            return "ui-vendor";
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
