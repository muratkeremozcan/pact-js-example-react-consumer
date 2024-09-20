import ErrorComponent from './error-component'

describe('<ErrorComponent />', () => {
  it('should render error message', () => {
    cy.mount(<ErrorComponent />)
    cy.getByCy('error').should('be.visible')
  })
})
