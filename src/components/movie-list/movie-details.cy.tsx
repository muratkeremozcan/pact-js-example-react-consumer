import MovieDetails from './movie-details'

describe('<MovieDetails />', () => {
  it('should make a unique network call depending on the input', () => {
    cy.intercept('GET', '/movies?*', {statusCode: 200}).as('getMovieByName')
    cy.intercept('GET', '/movies/*', {statusCode: 200}).as('getMovieById')
    cy.wrappedMount(<MovieDetails />)

    cy.getByCy('movie-details-input').type('123')
    cy.getByCy('get-movie-button').click()
    cy.wait('@getMovieById')

    cy.getByCy('movie-details-input')
      .clear()
      .type('The Godfather 123', {delay: 0})
    cy.getByCy('get-movie-button').click()
    cy.wait('@getMovieByName')
  })
})
