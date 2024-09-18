[![unit-lint-typecheck-e2e-ct](https://github.com/muratkeremozcan/react-cypress-ts-vite-template/actions/workflows/main.yml/badge.svg?branch=main)](https://github.com/muratkeremozcan/react-cypress-ts-vite-template/actions/workflows/main.yml)
![react version](https://img.shields.io/badge/react-18.3.1-brightgreen)
![cypress version](https://img.shields.io/badge/cypress-13.14.2-brightgreen)
![typescript version](https://img.shields.io/badge/typescript-5.6.2-brightgreen)
![jest version](https://img.shields.io/badge/jest-29.7.0-brightgreen)
[![renovate-app badge][renovate-badge]][renovate-app]

[renovate-badge]: https://img.shields.io/badge/renovate-app-blue.svg
[renovate-app]: https://renovateapp.com/

A template with React, TS, Cypress (e2e & ct), GHA with CI architecture, Jest,
ESLint, Prettier, Renovate, Husky, Lint-staged, and most of the things you need
to get started with a new project.

```bash
npm install --registry https://registry.npmjs.or # specify the registry in case you are using a proprietary registry

# parallel unit, typecheck, lint, format
npm run validate

# no need to have server running for these:
npm run cy:open-ct # for cypress component test runner
npm run cy:run-ct # headless version

# runs the ui and api servers, then opens e2e runner
npm run cy:open-e2e
npm run cy:run-e2e  # headless version

npm run test # run unit tests with jest
```

## CI

```
build  -->  Cypress e2e test
       -->  Cypress component test
       -->  Typecheck
       -->  Lint
       -->  Unit test
```
