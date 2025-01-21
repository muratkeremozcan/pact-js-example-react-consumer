import merge from 'lodash/merge'
import path from 'node:path'
import {baseConfig} from './base.config'
// eslint-disable-next-line import/named
import {defineConfig} from 'cypress'
import {config as dotenvConfig} from 'dotenv'
import viteConfig from '../../vite.config'

dotenvConfig({
  path: path.resolve(__dirname, '../../.env'),
})

const PORT = process.env.VITE_PORT

const cyViteConfig = merge(
  {},
  viteConfig({
    mode: process.env.NODE_ENV || 'development',
    command: 'serve',
  }),
  {
    resolve: {
      alias: {
        '@support': path.resolve(__dirname, '..', 'support'),
        '@fixtures': path.resolve(__dirname, '..', 'fixtures'),
        '@cypress': path.resolve(__dirname, '..'),
      },
    },
  },
)

const config: Cypress.ConfigOptions = {
  e2e: {
    env: {
      ENVIRONMENT: 'local',
      // map .env to Cypress.env
      ...process.env,
    },
    baseUrl: `http://localhost:${PORT}`, // Cypress.config
  },
  component: {
    experimentalSingleTabRunMode: true,
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
    devServer: {
      framework: 'react',
      bundler: 'vite',
      viteConfig: cyViteConfig,
    },
  },
}

export default defineConfig(merge({}, baseConfig, config))
