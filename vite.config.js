import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendOrigin = (env.VITE_BACKEND_ORIGIN || 'http://127.0.0.1:5000').replace(/localhost/i, '127.0.0.1')

  return {
    plugins: [
      vue(),
      vueDevTools(),
    ],
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
      emptyOutDir: true
    }
  }
})
