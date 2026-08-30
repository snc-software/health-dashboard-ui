import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      routeToken: 'route',
      autoCodeSplitting: true,
      routeFileIgnorePattern: '^(?!route\\.tsx$|__root\\.tsx$|_[^/]+\\.tsx$).+\\.(tsx|ts)$',
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
