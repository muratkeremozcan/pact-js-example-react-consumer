import {test, expect} from '@playwright/experimental-ct-react'
import LoadingMessage from './loading-message'

test.describe('<LoadingMessage>', () => {
  test('should render a loading message', async ({mount}) => {
    const component = await mount(<LoadingMessage />)

    // PW CT is in beta: PW has Issues with attribute selectors in component tests
    await expect(component.getByText('Loading movies...')).toBeVisible()
    // await expect(component.getByTestId('loading-message-comp')).toBeVisible() // this fails
  })
})
