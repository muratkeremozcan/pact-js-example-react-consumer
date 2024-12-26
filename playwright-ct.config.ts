import {defineConfig, devices} from '@playwright/experimental-ct-react'
import {baseConfig} from './pw/config/base.config'
import viteConfig from './vite.config'
import merge from 'lodash/merge'
import path from 'node:path'

const pwViteConfig = merge(
  {},
  viteConfig({
    mode: process.env.NODE_ENV || 'development',
    command: 'serve',
  }),
  {
    resolve: {
      alias: {
        '@support': path.resolve(__dirname, 'pw', 'support'),
        '@fixtures': path.resolve(__dirname, 'pw', 'support', 'fixtures'),
      },
    },
  },
)

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig(
  merge({}, baseConfig, {
    testDir: './src',
    testMatch: '**/*.ct.tsx',
    use: {
      ...baseConfig.use,
      ctPort: 3100,
      ctViteConfig: pwViteConfig,
    },
    /* We only need Chrome for component tests */
    projects: [
      {
        name: 'chromium',
        use: {...devices['Desktop Chrome']},
      },
    ],
  }),
)
