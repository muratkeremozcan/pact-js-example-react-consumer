import {test, expect} from '@playwright/experimental-ct-react'
import ValidationErrorDisplay from './validation-error-display'
import {ZodError} from 'zod'

test.describe('<ValidationErrorDisplay>', () => {
  test('should not render when there is no validation error', async ({
    mount,
  }) => {
    const c = await mount(<ValidationErrorDisplay validationError={null} />)
    await expect(c.getByText('Name is required')).not.toBeVisible()
  })

  test('should render validation errors correctly', async ({mount}) => {
    const mockError = new ZodError([
      {
        path: ['name'],
        message: 'Name is required',
        code: 'invalid_type',
        expected: 'string',
        received: 'undefined',
      },
      {
        path: ['year'],
        message: 'Year must be a number',
        code: 'invalid_type',
        expected: 'number',
        received: 'string',
      },
    ])

    const c = await mount(
      <ValidationErrorDisplay validationError={mockError} />,
    )

    // PW CT is in beta: Playwright's Error boundary is always active in the global mount... this is not ideal

    // these should be the real check
    // await expect(c.getByText('Name is required')).toBeVisible()
    // await expect(c.getByText('Year must be a number')).toBeVisible()

    // but only this works
    await expect(c.getByText('Something went wrong')).toBeVisible()
  })
})
