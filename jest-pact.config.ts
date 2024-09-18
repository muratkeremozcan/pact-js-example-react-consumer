import type {JestConfigWithTsJest} from 'ts-jest'

export const config: JestConfigWithTsJest = {
  clearMocks: true,
  testTimeout: 20000, // Can be longer due to pact tests
  collectCoverage: false, // You can disable coverage for pact tests if needed
  moduleDirectories: ['node_modules', 'src'],
  modulePathIgnorePatterns: ['dist'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {tsconfig: 'tsconfig.jest.json'}],
  },
  testMatch: ['**/*.pacttest.ts'], // Pact test file match
  testEnvironment: 'node',
}

export default config
