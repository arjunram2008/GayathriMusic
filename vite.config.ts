import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: {
        name: 'Student Payment Tracker',
        short_name: 'PaymentTracker',
        description: 'Mobile-first PWA for school payment tracking',
        start_url: '/',
        scope: '/',
        theme_color: '#DFF7F0',
        background_color: '#F6FCFB',
        display: 'standalone',
        orientation: 'portrait'
      },
      registerType: 'autoUpdate'
    })
  ],
  server: {
    port: 5173
  }
});
