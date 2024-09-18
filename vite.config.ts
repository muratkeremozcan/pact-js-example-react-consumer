import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/movies': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/movie': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  plugins: [react()],
})
