import merge from 'lodash/merge'
import path from 'node:path'
import {baseConfig} from './base.config'
// eslint-disable-next-line import/named
import {defineConfig} from 'cypress'

require('dotenv').config({
  path: path.resolve(__dirname, '../../.env'),
})

const PORT = process.env.VITE_PORT
const API_URL = process.env.VITE_API_URL

const config: Cypress.ConfigOptions = {
  e2e: {
    env: {
      ENVIRONMENT: 'local',
      apiUrl: `${API_URL}`, // Cypress.env
    },
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
  },
}

export default defineConfig(merge({}, baseConfig, config))
