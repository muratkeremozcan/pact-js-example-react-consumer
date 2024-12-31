import {test, expect} from '@playwright/experimental-ct-react'
import ErrorComp from './error-component'

test.describe('<ErrorComponent />', () => {
  test('should render an error message', async ({mount}) => {
    const c = await mount(<ErrorComp />)
    await expect(c.getByTestId('error')).toBeVisible()
    await expect(c.locator('p')).toHaveText('Try reloading the page.')
  })
})
