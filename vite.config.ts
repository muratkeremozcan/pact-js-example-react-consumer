import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    server: {
      port: Number(env.VITE_PORT),
      host: true,
      proxy: {
        '/movies': {
          target: `http://localhost:${env.API_PORT}`,
          changeOrigin: true,
        },
        '/movie': {
          target: `http://localhost:${env.API_PORT}`,
          changeOrigin: true,
        },
      },
    },
    plugins: [react()],
  }
})
