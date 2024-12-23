/* eslint-disable @typescript-eslint/no-explicit-any */
import {test as base} from '@playwright/test'
import {
  spyOn as spyOnFunction,
  stubMethod as stubMethodFunction,
} from '../utils/spy-stub-helper'

type SpyOnFunction = (objectName: string, method: string) => Promise<any[]>
type StubMethodFunction = (
  objectName: string,
  method: string,
  implementation?: (...args: any[]) => any,
) => Promise<any[]>

// Extend the base test with our custom fixture
const test = base.extend<{
  spyOn: SpyOnFunction
  stubMethod: StubMethodFunction
}>({
  spyOn: async ({page}, use) => {
    const spyOn: SpyOnFunction = (objectName, method) =>
      spyOnFunction(page, objectName, method)
    await use(spyOn)
  },

  stubMethod: async ({page}, use) => {
    const stubMethod: StubMethodFunction = (
      objectName,
      method,
      implementation,
    ) => stubMethodFunction(page, objectName, method, implementation)
    await use(stubMethod)
  },
})

export {test}

/*
We can have a base fixtures file and we can extend it

// fixtures.ts
import { mergeTests } from '@playwright/test';
import { test as baseTest } from './base-fixtures';
import { test as authTest } from './auth-fixtures';
import { test as apiTest } from './api-fixtures';

const test = mergeTests(baseTest, authTest, apiTest);

export { test };
*/
