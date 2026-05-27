import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// On GitHub Pages the site lives at /OS-Portfolio/, locally it lives at /.
const BASE = process.env.VITE_BASE ?? (process.env.GITHUB_ACTIONS ? '/OS-Portfolio/' : '/');

export default defineConfig({
  base: BASE,
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('vue-router')) return 'router';
            if (id.includes('pinia')) return 'pinia';
            if (id.includes('vue')) return 'vue';
            return 'vendor';
          }
          if (id.includes('/components/apps/')) {
            const match = id.match(/apps\/(\w+)/);
            if (match) return `app-${match[1].toLowerCase()}`;
          }
        },
      },
    },
  },
  server: {
    port: 3000,
    strictPort: false,
    open: false,
  },
});
