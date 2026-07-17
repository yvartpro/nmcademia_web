import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendOrigin = (env.VITE_BACKEND_ORIGIN || 'http://127.0.0.1:5000').replace(/localhost/i, '127.0.0.1')
  const isDev = mode === 'development'

  return {
    plugins: [
      vue(),
      // Only load devtools in development — saves ~50kB in production
      isDev && vueDevTools(),
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    server: {
      proxy: {
        '/api': {
          target: backendOrigin,
          changeOrigin: true
        },
        '/uploads': {
          target: backendOrigin,
          changeOrigin: true
        },
        '/socket.io': {
          target: backendOrigin,
          ws: true,
          changeOrigin: true
        }
      }
    },
    build: {
      outDir: '../api/public',
      emptyOutDir: true,
      target: 'esnext',
      rolldownOptions: {
        output: {
          // Split large vendor libraries into separate cacheable chunks.
          // rolldown (Vite 8) requires manualChunks to be a function.
          manualChunks: (id) => {
            if (id.includes('node_modules/vue') || id.includes('node_modules/pinia') || id.includes('node_modules/vue-router')) {
              return 'vendor-vue';
            }
            if (id.includes('node_modules/hls.js')) {
              return 'vendor-hls';
            }
            if (id.includes('node_modules/socket.io-client') || id.includes('node_modules/engine.io-client')) {
              return 'vendor-socket';
            }
            if (id.includes('node_modules/lucide-vue-next')) {
              return 'vendor-ui';
            }
            if (id.includes('node_modules/axios')) {
              return 'vendor-axios';
            }
          }
        }
      }
    }
  }
})

