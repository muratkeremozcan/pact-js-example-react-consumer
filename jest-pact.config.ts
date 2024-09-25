import type {JestConfigWithTsJest} from 'ts-jest'
import {transform} from './jest.config'

export const config: JestConfigWithTsJest = {
  clearMocks: true,
  testTimeout: 20000, // Can be longer due to pact tests
  collectCoverage: false, // You can disable coverage for pact tests if needed
  moduleDirectories: ['node_modules', 'src'],
  modulePathIgnorePatterns: ['dist'],
  transform: transform(),
  testMatch: ['**/*.pacttest.ts'], // Pact test file match
  testEnvironment: 'node',
}

export default config
