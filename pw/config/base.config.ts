import {defineConfig, devices} from '@playwright/test'

export const baseConfig = defineConfig({
  testDir: '../e2e',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 4 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'html' : 'list',
  timeout: process.env.CI ? 15000 : 5000,
  use: {
    trace: 'retain-on-first-failure',
    testIdAttribute: 'data-cy',
  },
  projects: [
    {
      name: 'chromium',
      use: {...devices['Desktop Chrome']},
    },
  ],
})
