import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import progress from 'vite-plugin-progress';

export default defineConfig({
  plugins: [
    react(),
    progress()
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@shared': path.resolve(__dirname, 'packages/shared'),
    },
  },

  css: {
    modules: {
      localsConvention: 'camelCase',
    },
    preprocessorOptions: {
      scss: {
        // additionalData: `@use "@/styles/variables.scss" as *;`
      },
    },
  },

  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },

  server: {
    port: 3000,
  },
});