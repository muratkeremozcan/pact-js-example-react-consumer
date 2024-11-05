import {ZodError} from 'zod'
import ValidationErrorDisplay from './validation-error-display'

describe('<ValidationErrorDisplay />', () => {
  it('should render validation errors correctly', () => {
    const mockError = new ZodError([
      {
        path: ['name'],
        message: 'Name is required',
        code: 'invalid_type',
        expected: 'string',
        received: 'undefined',
      },
    ])

    cy.wrappedMount(<ValidationErrorDisplay validationError={mockError} />)

    cy.getByCy('validation-error').should('have.length', 1)
    cy.contains('Name is required')
    cy.contains('Year must be a number')
  })

  it('should not render when there is no validation error', () => {
    cy.wrappedMount(<ValidationErrorDisplay validationError={null} />)
    cy.getByCy('validation-error').should('not.exist')
  })
})
