import {generateMovie} from '@support/factories'
import App from './App'

describe('App', () => {
  it('should verify child components', () => {
    const movie1 = {id: 1, ...generateMovie()}
    const movie2 = {id: 2, ...generateMovie()}
    cy.intercept('/movies', {
      body: [[movie1, movie2]],
      delay: 100,
    })

    cy.wrappedMount(<App />)
    cy.getByCy('loading-message-comp').should('be.visible')

    cy.getByCy('movie-list-comp').should('be.visible')
    cy.getByCy('movie-form-comp').should('be.visible')
  })
})
