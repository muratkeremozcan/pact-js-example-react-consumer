import {test as base, mergeTests} from '@playwright/test'
import {test as baseFixtures} from './fixtures/base-fixtures'
import {test as apiRequestFixture} from './fixtures/api-request-fixture'
import {test as crudHelperFixtures} from './fixtures/crud-helper-fixture'
import {test as networkFixture} from './fixtures/network-fixture'

// Merge the fixtures
const test = mergeTests(
  baseFixtures,
  apiRequestFixture,
  crudHelperFixtures,
  networkFixture,
) // Add new fixtures as arguments

const expect = base.expect
export {test, expect}
