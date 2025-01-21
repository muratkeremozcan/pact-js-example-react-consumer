import type {Page} from '@playwright/test'
import {test as base, expect} from '@playwright/test'

export const test = base.extend<{page: Page; failOnJSError: boolean}>({
  // The first element true is the default value for the failOnJSError fixture
  // The second element { option: true } is a configuration object that tells Playwright this fixture can be configured per test
  failOnJSError: [true, {option: true}],
  page: async ({page, failOnJSError}, use) => {
    // before
    const errors: Array<Error> = []

    page.addListener('pageerror', error => {
      errors.push(error)
    })

    await use(page)

    // after
    if (failOnJSError) {
      expect(errors).toHaveLength(0)
    }
  },
})

/*

To turn off failing on JS error
in the beginning of a test file insert:

test.use({ failOnJSError: false })

*/
