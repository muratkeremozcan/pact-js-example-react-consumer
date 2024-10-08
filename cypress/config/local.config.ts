import merge from 'lodash/merge'
import path from 'node:path'
import {baseConfig} from './base.config'
// eslint-disable-next-line import/named
import {defineConfig} from 'cypress'
import {config as dotenvConfig} from 'dotenv'
import tasks from '@support/tasks'
import plugins from '@support/plugins'

dotenvConfig({
  path: path.resolve(__dirname, '../../.env'),
})

const PORT = process.env.VITE_PORT

const config: Cypress.ConfigOptions = {
  e2e: {
    baseUrl: `http://localhost:${PORT}`, // Cypress.config
  },
  component: {
    experimentalJustInTimeCompile: true,
    experimentalSingleTabRunMode: true,
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
    setupNodeEvents(on, config) {
      tasks(on)
      return plugins(on, config)
    },
  },
}

export default defineConfig(merge({}, baseConfig, config))
