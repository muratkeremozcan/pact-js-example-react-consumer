module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'plugin:import/recommended',
    'plugin:cypress/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.jest.json'],
  },
  plugins: [
    '@typescript-eslint',
    'implicit-dependencies',
    'no-only-tests',
  ],
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
  ignorePatterns: ['dist', 'node_modules', 'scripts', '**/*.d.ts'],
  root: true,
  rules: {
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/consistent-type-exports': 'error',
    'no-only-tests/no-only-tests': 'error',
    '@typescript-eslint/no-unused-vars': ['error', {argsIgnorePattern: '^_'}],
    complexity: ['warn', 15],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    'import/default': 'off',
    '@typescript-eslint/no-require-imports': 'off',
    'cypress/unsafe-to-chain-command': 'off',
  },
}
