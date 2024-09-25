[![unit-lint-typecheck-e2e-ct](https://github.com/muratkeremozcan/react-cypress-ts-vite-template/actions/workflows/main.yml/badge.svg?branch=main)](https://github.com/muratkeremozcan/react-cypress-ts-vite-template/actions/workflows/main.yml)
![react version](https://img.shields.io/badge/react-18.3.1-brightgreen)
![cypress version](https://img.shields.io/badge/cypress-13.14.2-brightgreen)
![typescript version](https://img.shields.io/badge/typescript-5.6.2-brightgreen)
![jest version](https://img.shields.io/badge/jest-29.7.0-brightgreen)
[![renovate-app badge][renovate-badge]][renovate-app]

[renovate-badge]: https://img.shields.io/badge/renovate-app-blue.svg
[renovate-app]: https://renovateapp.com/

This repo is a mirror of [pact-js-react-consumer](https://github.com/muratkeremozcan/pact-js-example-consumer), but it includes a real  react UI. 

The Axios calls to the backend (`consumer.ts`) and the pact tests `consumer-contract.pacttest.ts` are 99% similar.

This setup is intended to compare and contrast consumer driven contract testing, versus bi-directional (provider driven) contract testing.

The Pact related setup from [pact-js-react-consumer](https://github.com/muratkeremozcan/pact-js-example-consumer) still applies here - but if you have done that setup at the Pact broker already, the only setup here is the `.env` file and repo secrets. Use the sample `.env.example` file to create a `.env` file of your own. These values will also have to exist in your CI secrets.

```bash
# create a free pact broker at
# https://pactflow.io/try-for-free/
PACT_BROKER_TOKEN=***********
PACT_BROKER_BASE_URL=https://yourownorg.pactflow.io
PORT=3000
```



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

### Consumer flow for Pact

Unlike traditional consumer driven contract testing, there is no need for a specific order of executions between the consumer and the provider. The provider only has to publish their OpenAPI spec, and consumer tests vs the OpenAPI spec is verified at the Pact broker.

We only verify against what's published at dev of the provider; the provider can make any changes to their OpenAPI spec, merge to main unimpeded, and we always have to ensure we're aligned with that at the consumer.

```bash
npm run test:consumer 
npm run publish:pact
npm run can:i:deploy:consumer 
# only on main
npm run record:consumer:deployment --env=dev # change the env param as needed
```

### Provider flow for Pact (Bi-directional contract testing)

```bash
npm run generate:openapi # generates an OpenAPI doc from Zod schemas
npm run publish:pact-openapi # publishes the open api spec to Pact Broker for BDCT
npm run record:provider:bidirectional:deployment --env=dev # we still have to record the provider deployment
```

On the provider side, the generation of the OpenAPI spec happens automatically with every PR and gets committed to the repo if there are any changes in the spec file.

All non-pact-bi-directional related testing happens in PRs (including schema testing), so we are 100% confident of the commit quality.

The merge to main happens on a passing PR.

Finally, on main. we have `contract-publish-openapi.yml` , which publishes the OpenAPI spec to Pact broker with `npm run publish:pact-openapi` and records the bi-directional provider deployment with `npm run npm run record:provider:bidirectional:deployment --env=dev`.

### Bi-directional contract testing details

In CDCT, the consumer tests are executed on the provider side, which mandates that the provider server can be served locally. This might be a blocker for CDCT.
It might also happen that we want to contract-test against a provider outside of the org.

BDCT offers an easier alternative to CDCT. All you need is the OpenAPI spec of the provider, and the consumer side stays the same.

Here is how it goes:

1. **Generate the OpeAPI spec at the provider**

   Automate this step using tools like `zod-to-openapi`, `swagger-jsdoc`, [generating OpenAPI documentation directly from TypeScript types, or generating the OpenAPI spec from e2e tests (using Optic)](https://dev.to/muratkeremozcan/automating-api-documentation-a-journey-from-typescript-to-openapi-and-schema-governence-with-optic-ge4). Manual spec writing is the last resort.

2. **Ensure that the spec matches the real API**

   `cypress-ajv-schema-validator`: if you already have cy e2e and you want to easily chain on to the existing api calls.

   Optic: lint the schema and/or run the e2e suite against the OpenAPI spec through the Optic proxy.

   Dredd: executes its own tests (magic!) against your openapi spec (needs your local server, has hooks for things like auth.)

3. **Publish the OpenAPI spec to the pact broker**.

   ```bash
   pactflow publish-provider-contract
     src/api-docs/openapi.json # path to OpenAPI spec
     # if you also have classic CDCT in the same provider,
     # make sure to label the Bi-directional provider name differently
     --provider MoviesAPI-bi-directional
     --provider-app-version=$GITHUB_SHA # best practice
     --branch=$GITHUB_BRANCH # best practice
     --content-type application/json # yml ok too if you prefer
     --verification-exit-code=0 # needs it
      # can be anything, we just generate a file on e2e success to make Pact happy
     --verification-results ./cypress/verification-result.txt
     --verification-results-content-type text/plain # can be anything
     --verifier cypress # can be anything
   ```

   Note that verification arguments are optional, and without them you get a warning at Pact broker that the OpenAPI spec is untested.

4. **Record the provider bi-directional deployment**.

   We still have to record the provider bi-directional, similar to how we do it in CDCT.
   Otherwise the consumers will have nothing to compare against.

   ```bash
   npm run record:provider:bidirectional:deployment --env=dev
   ```

5. **Execute the consumer contract tests**

   Execution on the Consumer side works exactly the same as classic CDCT.

As you can notice, there is nothing about running the consumer tests on the provider side ( `test:provider`), can-i-deploy checks (`can:i:deploy:provider`),. All you do is get the OpenAPI spec right, publish it to Pact Broker, and record the deployment.

The [api calls](https://github.com/muratkeremozcan/pact-js-example-react-consumer/blob/main/src/consumer.ts) are the same as the plain, non-UI app used int CDCT.

We cannot have CDCT and BDCT in the same contract relationship. Although, we can have the provider have consumer driven contracts with some consumers and provider driven contracts with others

```bash
Consumer        -> CDCT  -> Provider

Consumer-React  <- BDCT  <- Provider
```

