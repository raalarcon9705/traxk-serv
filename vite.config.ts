import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    tailwindcss(), 
    reactRouter(), 
    tsconfigPaths(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'apple-touch-icon-precomposed.png', 'apple-touch-icon-120x120.png', 'apple-touch-icon-120x120-precomposed.png', 'icons/manifest-icon-192.maskable.png', 'icons/manifest-icon-512.maskable.png'],
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'TrackServ - Gestión de Servicios',
        short_name: 'TrackServ',
        description: 'Gestión de comisiones de proveedores de servicios',
        theme_color: '#10B981',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'icons/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icons/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icons/manifest-icon-192.maskable.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: 'icons/manifest-icon-512.maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      strategies: 'generateSW',
      workbox: {
        globPatterns: ['**/*.{js,css,ico,png,svg,webmanifest}'],
        skipWaiting: true,
        clientsClaim: true,
        disableDevLogs: false,
        navigateFallback: '/',
        navigateFallbackDenylist: [/^\/api\//, /\.(?:png|jpg|jpeg|svg|ico|webmanifest)$/],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 // 1 día
              }
            }
          }
        ]
      }
    })
  ],
  optimizeDeps: {
    include: ['recharts', 'react-is']
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/]
    }
  }
});
