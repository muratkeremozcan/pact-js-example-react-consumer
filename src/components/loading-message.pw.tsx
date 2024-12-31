import {test, expect} from '@playwright/experimental-ct-react'
import LoadingMessage from './loading-message'

test.describe('<LoadingMessage>', () => {
  test('should render a loading message', async ({mount}) => {
    const c = await mount(<LoadingMessage />)

    // PW CT is in beta: PW has Issues with attribute selectors in component tests
    await expect(c.getByText('Loading movies...')).toBeVisible()
    // await expect(c.getByTestId('loading-message-comp')).toBeVisible() // this fails
  })
})
