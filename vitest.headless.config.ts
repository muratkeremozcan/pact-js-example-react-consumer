import baseConfig from './vitest.config'
import {defineConfig} from 'vitest/config'

// merges your base config, but overrides environment + browser
export default defineConfig({
  ...baseConfig,
  test: {
    ...baseConfig.test,
    environment: 'jsdom',
    browser: {
      enabled: false,
      name: 'chromium',
    },
  },
})
