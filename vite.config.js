import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'node:path';
// vite.config.ts — Vite + React + PWA（§12.1）
export default defineConfig({
    base: '/talent-pool/',
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.svg', 'icons/icon-192.svg', 'icons/icon-512.svg'],
            manifest: {
                name: '猎头人才库',
                short_name: '人才库',
                description: '智能猎头候选人管理系统',
                theme_color: '#2563EB',
                background_color: '#ffffff',
                display: 'standalone',
                orientation: 'portrait',
                scope: '/talent-pool/',
                start_url: '/talent-pool/',
                icons: [
                    { src: '/talent-pool/icons/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' },
                    { src: '/talent-pool/icons/icon-512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'any maskable' }
                ]
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
                runtimeCaching: [
                    {
                        // 静态资源缓存 30 天
                        urlPattern: function (_a) {
                            var url = _a.url;
                            return url.origin === self.location.origin;
                        },
                        handler: 'CacheFirst',
                        options: { cacheName: 'static-cache', expiration: { maxAgeSeconds: 60 * 60 * 24 * 30 } }
                    }
                ]
            }
        })
    ],
    resolve: {
        alias: { '@': path.resolve(__dirname, 'src') }
    }
});
