import LoadingMessage from './loading-message'

describe('<LoadingMessage>', () => {
  it('should render a loading message', () => {
    cy.mount(<LoadingMessage />)
    cy.getByCy('loading-message-comp').should('be.visible')
  })
})
