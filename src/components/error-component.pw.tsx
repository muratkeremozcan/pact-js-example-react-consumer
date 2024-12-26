import {test, expect} from '@playwright/experimental-ct-react'
import ErrorComp from './error-component'

test.describe('<ErrorComp>', () => {
  test('should render an error message', async ({mount}) => {
    const component = await mount(<ErrorComp />)
    await expect(component.getByTestId('error')).toBeVisible()
    await expect(component.locator('p')).toHaveText('Try reloading the page.')
  })
})
