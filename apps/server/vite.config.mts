import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import { mockApi } from './mock-api.mjs';

/**
 * Vite Configuration.
 *
 * Builds the dashboard into build/admin, served at /admin. Development proxies API calls
 * to the running server or answers them from the mock API. The server's .env files
 * aren't loaded, so their NODE_ENV can't turn a build into a development build.
 *
 * @since 1.0.0
 */
export default defineConfig(({ mode }) => ({
  base: '/admin/',
  build: {
    emptyOutDir: true,
    outDir: 'build/admin',
  },
  envDir: false,
  plugins: (mode === 'mock') ? [
    react(),
    mockApi(),
  ] : [react()],
  publicDir: 'src/web/public',
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
  server: {
    port: 5176,
    proxy: (mode === 'mock') ? {} : {
      '/api': 'http://127.0.0.1:22601',
      '/metrics': 'http://127.0.0.1:22601',
      '/v1': 'http://127.0.0.1:22601',
    },
  },
}));
