import {defineConfig, mergeConfig} from 'vitest/config'
import viteConfig from './vite.config'

const viteConfigBase = viteConfig({
  mode: process.env.NODE_ENV || 'test',
  command: 'serve',
})

export default mergeConfig(
  viteConfigBase,
  defineConfig({
    test: {
      environment: 'jsdom',
      setupFiles: ['./vitest.setup.ts', './jest.setup.ts'],
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
