import App from './App'

describe('CT sanity', () => {
  it('passes sanity', () => {
    cy.intercept('/movies', {
      delay: 1000,
      body: [{id: 1, name: 'Inception', year: 2010}],
    })

    cy.wrappedMount(<App />)

    cy.contains('Movie List')
  })
})
