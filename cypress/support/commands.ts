// put e2e + CT common commands here
import 'cypress-map'

// @ts-expect-error per plugin docs
import registerCypressGrep from '@bahmutov/cy-grep'
// @ts-expect-error per plugin docs
import {failedTestToggle} from 'cypress-plugin-last-failed'

registerCypressGrep()
failedTestToggle()

Cypress.Commands.add('getByCy', (selector, ...args) =>
  cy.get(`[data-cy="${selector}"]`, ...args),
)

Cypress.Commands.add('getByCyLike', (selector, ...args) =>
  cy.get(`[data-cy*=${selector}]`, ...args),
)
