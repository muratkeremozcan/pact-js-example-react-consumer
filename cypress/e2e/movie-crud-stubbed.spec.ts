describe('movie crud e2e', () => {
  const {name, year} = {name: 'Inception', year: 2010}
  const movie = {id: 1, name, year}

  it('should add a movie', () => {
    cy.intercept('GET', '**/movies', {body: []}).as('noMovies')
    cy.visit('/')
    cy.contains('Movie List')
    cy.wait('@noMovies')

    cy.getByCy('movie-input-comp-text').type(name)
    cy.getByCy('movie-input-comp-number').clear().type(`${year}{backspace}`)

    cy.intercept('POST', '/movies', {
      body: {
        ...movie,
      },
    }).as('addMovie')
    cy.intercept('GET', '**/movies', {body: [movie]}).as('getMovies')

    cy.getByCy('add-movie-button').click()
    cy.wait('@getMovies')
    cy.wait('@addMovie')
  })

  it('should delete movie', () => {
    cy.intercept('GET', '**/movies', {body: [movie]}).as('getMovies')
    cy.visit('/')
    cy.contains('Movie List')
    cy.wait('@getMovies')

    cy.intercept('DELETE', '/movie/*', {statusCode: 200}).as('deleteMovie')
    cy.intercept('GET', '**/movies', {body: []}).as('getMoviesEmpty')

    cy.getByCy(`delete-movie-${name}`).click()
    cy.wait('@deleteMovie')
    cy.wait('@getMoviesEmpty')
    cy.getByCy(`delete-movie-${name}`).should('not.exist')
  })
})
