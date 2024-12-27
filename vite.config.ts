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
        '@cypress': path.resolve(__dirname, 'cypress'),
        '@pw': path.resolve(__dirname, 'pw'),
        '@styles': path.resolve(__dirname, 'src', 'styles'),
        '@provider-schema': path.resolve(__dirname, 'src', 'provider-schema'),
        '@vitest-utils': path.resolve(
          __dirname,
          'src',
          'test-utils',
          'vitest-utils',
        ),
      },
    },
  }
})
