import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },

    server: {
      host: true,
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },

    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          new: path.resolve(__dirname, 'new.html'),
        },
      },
    },

    preview: {
      host: true,
      port: process.env.PORT ? parseInt(process.env.PORT, 10) : 4173,
      allowedHosts: true as any,
    },
  };
});
