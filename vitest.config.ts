/// <reference types="vitest" />
import {defineConfig, mergeConfig} from 'vitest/config'
import viteConfig from './vite.config'

const baseConfig = viteConfig({
  mode: process.env.NODE_ENV || 'test',
  command: 'serve',
})

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      setupFiles: ['./vitest.setup.ts'],
      include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
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
