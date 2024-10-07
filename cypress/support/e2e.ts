import type {Movie} from '../../src/consumer'
import './commands'
import './get-token'
import '@bahmutov/cy-api'

const commonHeaders = (token: string) => ({
  Authorization: token,
})

Cypress.Commands.add(
  'addMovie',
  (
    body: Omit<Movie, 'id'>,
    baseUrl = Cypress.env('VITE_API_URL'),
    allowedToFail = false,
  ) => {
    cy.log('**addMovie**')
    return cy.maybeGetToken('token-session').then(token =>
      cy.request({
        method: 'POST',
        url: `${baseUrl}/movies`,
        body: body,
        headers: commonHeaders(token),
        retryOnStatusCodeFailure: !allowedToFail,
        failOnStatusCode: !allowedToFail,
      }),
    )
  },
)
