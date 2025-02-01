import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: 'client', // Ensures Vite serves from 'client/'
  plugins: [react()],
  build: {
    outDir: 'dist', // Ensures Vite builds inside 'client/dist/'
    emptyOutDir: true, // Clears old build files before each build
  },
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
});
