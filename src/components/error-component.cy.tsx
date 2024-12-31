import ErrorComponent from './error-component'

describe('<ErrorComponent />', () => {
  it('should render an error message', () => {
    cy.mount(<ErrorComponent />)
    cy.getByCy('error').should('be.visible')
    cy.contains('p', 'Try reloading the page')
  })
})
