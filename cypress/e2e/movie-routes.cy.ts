import {generateMovie} from '@support/factories'
import type {Movie} from '../../src/consumer'

describe('App routes', () => {
  const movies = [
    {id: 1, ...generateMovie()},
    {id: 2, ...generateMovie()},
    {id: 3, ...generateMovie()},
  ]
  const movie = movies[0]

  beforeEach(() => {
    cy.intercept('GET', '/movies', {body: {data: movies}}).as('getMovies')
  })

  it('should redirect to /movies', () => {
    cy.visit('/')

    cy.location('pathname').should('eq', '/movies')
    cy.wait('@getMovies').its('response.body.data').should('deep.eq', movies)

    cy.getByCy('movie-list-comp').should('be.visible')
    cy.getByCy('movie-form-comp').should('be.visible')
    cy.getByCy('movie-item-comp').should('have.length', movies.length)
  })

  it('should direct nav to by query param', () => {
    const movieName = encodeURIComponent(movie?.name as Movie['name'])

    cy.visit(`/movies?name=${movieName}`)
    cy.intercept('GET', '/movies?*', {body: movie}).as('getMovieByName')

    cy.wait('@getMovieByName').its('response.body').should('deep.eq', movie)
    cy.location('search').should('eq', `?name=${movieName}`)
  })
})
