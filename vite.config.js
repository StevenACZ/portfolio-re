import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    chunkSizeWarningLimit: 1000, // Increase limit for better chunking
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'gsap-vendor': ['gsap', '@gsap/react'],
          'three-vendor': ['three'],
          'ui-vendor': ['lucide-react', 'typewriter-effect'],
        },
      },
    },
  },
  preview: {
    port: 4173,
    host: true,
  },
});
