import type {Movie} from '../../src/consumer'
import './commands'
import '@bahmutov/cy-api'

Cypress.Commands.add(
  'addMovie',
  (
    body: Omit<Movie, 'id'>,
    baseUrl = Cypress.env('VITE_API_URL'),
    allowedToFail = false,
  ) => {
    cy.log('**addMovie**')
    return cy.request({
      method: 'POST',
      url: `${baseUrl}/movies`,
      body: body,
      retryOnStatusCodeFailure: !allowedToFail,
      failOnStatusCode: !allowedToFail,
    })
  },
)
