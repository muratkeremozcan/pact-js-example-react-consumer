/* eslint-disable @typescript-eslint/no-var-requires */
import {defineConfig} from 'cypress'
import {baseConfig} from './base.config'
import path from 'node:path'
import merge from 'lodash/merge'

require('dotenv').config({
  path: path.resolve(__dirname, '../../.env'),
})

const PORT = process.env.VITE_PORT
const API_PORT = process.env.VITE_API_PORT

const config: Cypress.ConfigOptions = {
  e2e: {
    env: {
      ENVIRONMENT: 'local',
      apiUrl: `http://localhost:${API_PORT}`, // Cypress.env
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
