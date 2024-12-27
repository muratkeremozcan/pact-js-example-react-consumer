import {defineConfig, mergeConfig} from 'vitest/config'
import viteConfig from './vite.config'

const viteConfigBase = viteConfig({
  mode: process.env.NODE_ENV || 'test',
  command: 'serve',
})

const config = mergeConfig(
  viteConfigBase,
  defineConfig({
    test: {
      browser: {
        enabled: true,
        name: 'chromium',
        provider: 'playwright',
      },
      environment: 'happy-dom',
      setupFiles: ['./vitest.setup.ts'],
      include: ['src/**/*.vitest.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      exclude: [
        'node_modules/**',
        'pw/**',
        'cypress/**',
        'src/consumer.test.ts',
        'src/**/*.pacttest.ts',
        'src/**/*.pw.test.ts',
        'src/**/*.cy.test.ts',
      ],
    },
  }),
)

export default config
