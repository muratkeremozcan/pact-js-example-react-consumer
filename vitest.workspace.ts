import {defineWorkspace} from 'vitest/config'

export default defineWorkspace([
  {
    extends: './vitest.config.ts',
    test: {
      name: 'react-tests',
      browser: {
        enabled: true,
        name: 'chromium',
        provider: 'playwright',
        providerOptions: {},
      },
      include: ['src/components/**/*.test.{ts,tsx}'],
      exclude: ['**/*.pw.*', '**/*.cy.*', '**/pw/**', '**/cypress/**'],
    },
  },
])
