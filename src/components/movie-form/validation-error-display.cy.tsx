import {ZodError} from 'zod'
import ValidationErrorDisplay from './validation-error-display'

describe('<ValidationErrorDisplay />', () => {
  it('should not render when there is no validation error', () => {
    cy.wrappedMount(<ValidationErrorDisplay validationError={null} />)
    cy.getByCy('validation-error').should('not.exist')
  })

  it('should render validation errors correctly', () => {
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

    cy.wrappedMount(<ValidationErrorDisplay validationError={mockError} />)

    cy.getByCy('validation-error').should('have.length', 2)
    cy.contains('Name is required')
    cy.contains('Year must be a number')
  })
})
