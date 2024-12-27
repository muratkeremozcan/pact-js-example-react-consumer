import baseConfig from './vitest.config'
import {defineConfig} from 'vitest/config'

export default defineConfig({
  ...baseConfig,
  test: {
    ...baseConfig.test,
    // optionally environment: 'jsdom',
    browser: {
      enabled: true,
      name: 'chromium',
      provider: 'playwright',
      headless: false,
    },
  },
})
