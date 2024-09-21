import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    server: {
      port: Number(env.VITE_PORT),
      host: true,
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@components': path.resolve(__dirname, 'src', 'components'),
        '@hooks': path.resolve(__dirname, 'src', 'hooks'),
        '@styles': path.resolve(__dirname, 'src', 'styles'),
        '@support': path.resolve(__dirname, 'cypress', 'support'),
        '@fixtures': path.resolve(__dirname, 'cypress', 'fixtures'),
        '@cypress': path.resolve(__dirname, 'cypress'),
        '@provider-schema': path.resolve(__dirname, 'src', 'provider-schema'),
      },
    },
  }
})
