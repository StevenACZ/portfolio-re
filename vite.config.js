import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react({
      // SWC configuration for optimal performance
      jsxImportSource: undefined, // Use default React import
      plugins: [], // No additional SWC plugins for maximum speed
    }),
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  server: {
    port: 3000,
    open: true,
    // Warmup frequently used files for faster dev server
    warmup: {
      clientFiles: [
        './src/Portfolio.jsx',          // Main component
        './src/components/HeroSection.jsx',     // Critical first paint
        './src/components/ThreeScene.jsx',      // Complex 3D component
        './src/components/Navbar.jsx',          // Always visible
        './src/components/SEOHead.jsx',         // Meta tags needed early
        './src/hooks/useScrollSpy.js',          // Navigation logic
        './src/hooks/useScrollToSection.js',    // Scroll behavior
        './src/styles/globals.css',             // Global styles
        './src/styles/HeroSection.css',         // Critical CSS
      ],
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    chunkSizeWarningLimit: 500, // Reduced for better chunking
    minify: 'terser',
    target: 'es2020', // Modern target for better optimization
    cssTarget: 'es2020',
    // Enhanced module preloading for better performance
    modulePreload: {
      polyfill: true,
      resolveDependencies: (filename, deps, { hostType }) => {
        // Smart preloading - prioritize critical path only
        return deps.filter(dep => {
          // Critical chunks for initial render
          const isCritical = dep.includes('react-vendor') || 
                           dep.includes('gsap-core') ||
                           dep.includes('gsap-react') ||
                           dep.includes('perf-vendor') ||
                           dep.includes('seo-vendor') ||
                           dep.includes('Portfolio') || 
                           dep.includes('HeroSection') ||
                           dep.includes('Navbar');
          
          // Don't preload Three.js - it's now lazy loaded
          const isThreeJS = dep.includes('three');
          
          return isCritical && !isThreeJS;
        });
      },
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'],
        dead_code: true,
        unused: true,
        // Additional optimizations
        passes: 2, // Run compression twice for better results
        ecma: 2020, // Target modern JS for better compression
      },
      mangle: {
        safari10: true,
        properties: {
          regex: /^_/, // Mangle private properties
        },
      },
      format: {
        comments: false, // Remove all comments
      },
    },
    rollupOptions: {
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false,
      },
      // Optimized input configuration for better chunking
      input: {
        main: './index.html',
      },
      output: {
        manualChunks: (id) => {
          // Critical vendor - React (highest priority for preloading)
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react-vendor';
          }
          
          // Three.js sub-chunking for better optimization
          if (id.includes('node_modules/three/')) {
            // Core Three.js - most frequently used
            if (id.includes('WebGLRenderer') || id.includes('Scene') || id.includes('PerspectiveCamera')) {
              return 'three-core';
            }
            // Geometry and materials - can be lazy loaded
            if (id.includes('Geometry') || id.includes('Material') || id.includes('Mesh')) {
              return 'three-objects';
            }
            // Lights - smallest chunk
            if (id.includes('Light')) {
              return 'three-lights';
            }
            // Remaining Three.js modules
            return 'three-vendor';
          }
          
          // GSAP - split by usage frequency
          if (id.includes('node_modules/gsap/')) {
            // Core GSAP
            if (id.includes('gsap.js') || id.includes('Timeline')) {
              return 'gsap-core';
            }
            // Plugins - can be loaded on demand
            return 'gsap-plugins';
          }
          if (id.includes('node_modules/@gsap/')) {
            return 'gsap-react';
          }
          
          // Performance utilities - small but frequently used
          if (id.includes('node_modules/typed.js/') || 
              id.includes('node_modules/react-intersection-observer/')) {
            return 'perf-vendor';
          }
          
          // UI libraries - icons and small utilities
          if (id.includes('node_modules/lucide-react/')) {
            return 'ui-vendor';
          }
          
          // SEO and meta - separate for critical path optimization
          if (id.includes('node_modules/@dr.pogodin/react-helmet/')) {
            return 'seo-vendor';
          }
          
          // Remaining vendor libraries
          if (id.includes('node_modules/')) {
            return 'vendor';
          }
        },
        // Optimize asset file names for caching
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/\.(png|jpe?g|webp|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
            return `images/[name]-[hash][extname]`;
          }
          if (/\.(css)$/i.test(assetInfo.name)) {
            return `css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
      },
    },
  },
  preview: {
    port: 4173,
    host: true,
  },
});
