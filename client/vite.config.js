import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // * Configured proxy to point to server when making API calls to express
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
});
