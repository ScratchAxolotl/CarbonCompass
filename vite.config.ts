import { defineConfig, UserConfig, PluginOption } from 'vite';
import react from '@vitejs/plugin-react';

const plugins: PluginOption[] = [react() as PluginOption];

const config: UserConfig = {
  root: 'client', // Ensures Vite serves from 'client/'
  plugins,
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
};

export default defineConfig(config);
