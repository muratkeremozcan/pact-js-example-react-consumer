import {describe, expect, it, screen, wrappedRender} from '@vitest-utils/utils'
import ErrorComponent from './error-component'

describe('<ErrorComponent />', () => {
  it('should render error message', () => {
    wrappedRender(<ErrorComponent />)

    expect(screen.getByTestId('error')).toBeVisible()
  })
})
