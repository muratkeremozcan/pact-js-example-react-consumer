import 'cypress-data-session'
const getToken = () =>
  cy
    .request({
      method: 'POST',
      url: `${Cypress.env('VITE_API_URL')}/auth/fake-token`,
    })
    .its('body.token')

const maybeGetToken = (sessionName: string) =>
  cy.dataSession({
    name: sessionName,

    validate: () => true,

    setup: () => getToken(),

    shareAcrossSpecs: true,
  })
Cypress.Commands.add('maybeGetToken', maybeGetToken)
