import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      },
      '/v1': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      },
      '/outputs': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      },
      '/examples': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      }
    }
  }
})
