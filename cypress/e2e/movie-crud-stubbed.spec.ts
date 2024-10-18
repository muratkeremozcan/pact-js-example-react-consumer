import {generateMovie} from '@support/factories'
import {editMovie} from '@support/helpers/edit-movie'

describe('movie crud e2e', () => {
  const {name, year, rating} = generateMovie()
  const id = 1
  const movie = {id, name, year, rating}
  const {
    name: editedName,
    year: editedYear,
    rating: editedRating,
  } = generateMovie()

  it('should add a movie', () => {
    cy.intercept('GET', '**/movies', {body: []}).as('noMovies')
    cy.visit('/')
    cy.wait('@noMovies')

    cy.getByCy('movie-input-comp-text').type(name, {delay: 0})
    cy.get('[placeholder="Movie year"]')
      .clear()
      .type(`${year}{backspace}`, {delay: 0})
    cy.get('[placeholder="Movie rating"]').clear().type(`${rating}`, {
      delay: 0,
    })
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

  it('should edit a movie', () => {
    cy.intercept('GET', '**/movies', {body: {data: [movie]}}).as('getMovies')
    cy.intercept('GET', '**/movies/*', {body: {data: movie}}).as('getMovieById')
    cy.visit('/')
    cy.wait('@getMovies')

    cy.getByCy(`link-${id}`).click()

    cy.location('pathname').should('eq', `/movies/${id}`)
    cy.wait('@getMovieById').its('response.body.data').should('deep.eq', movie)

    cy.intercept('PUT', `/movies/${id}`, {
      body: {
        id: movie.id,
        name: editedName,
        year: editedYear,
        rating: editedRating,
      },
    }).as('updateMovieById')

    editMovie(editedName, editedYear, editedRating)

    cy.wait('@updateMovieById')
  })

  it('should delete movie', () => {
    cy.intercept('GET', '**/movies', {body: {data: [movie]}}).as('getMovies')
    cy.visit('/')
    cy.contains('Movie List')
    cy.wait('@getMovies')

    cy.intercept('DELETE', '/movies/*', {statusCode: 200}).as('deleteMovieById')
    cy.intercept('GET', '**/movies', {body: []}).as('getMoviesEmpty')

    cy.getByCy(`delete-movie-${name}`).click()
    cy.wait('@deleteMovieById')
    cy.wait('@getMoviesEmpty')
    cy.getByCy(`delete-movie-${name}`).should('not.exist')
  })
})
