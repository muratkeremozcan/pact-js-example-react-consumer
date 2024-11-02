import {generateMovie} from '@support/factories'
import MovieDetails from './movie-details'
import spok from 'cy-spok'

describe('<MovieDetails />', () => {
  const id = 123
  const movieName = 'The Godfather 123'
  const movie = {id, ...generateMovie(), name: movieName}

  it('should make a unique network call when the route takes an id', () => {
    cy.intercept('GET', '/movies/*', {body: {data: movie}}).as('getMovieById')
    cy.routeWrappedMount(<MovieDetails />, {path: '/:id', route: `/${id}`})

    cy.wait('@getMovieById')
      .its('response.body.data')
      .should(spok({...movie}))
  })

  it('should make a unique network call when the route takes a query parameter', () => {
    cy.intercept('GET', `/movies?name=${encodeURIComponent(movieName)}`, {
      body: {data: movie},
    }).as('getMoviesByName')

    cy.routeWrappedMount(<MovieDetails />, {
      path: '/movies',
      route: `/movies?name=${encodeURIComponent(movieName)}`,
    })

    cy.wait('@getMoviesByName')
      .its('response.body.data')
      .should(spok({...movie}))
  })

  it('should display the default error with delay', () => {
    const error = 'Unexpected error occurred'
    cy.intercept('GET', '/movies/*', {
      statusCode: 400,
      delay: 20,
      body: {error},
    }).as('networkErr')
    cy.routeWrappedMount(<MovieDetails />, {path: '/:id', route: `/${id}`})
    cy.getByCy('loading-message-comp').should('be.visible')

    cy.wait('@networkErr').its('response.body.error').should('eq', error)

    cy.contains('Unexpected error occurred')
  })

  it('should display a specific error', () => {
    const error = 'Movie not found'
    cy.intercept('GET', '/movies/*', {
      statusCode: 400,
      body: {
        error: {
          error,
        },
      },
    }).as('networkErr')

    cy.routeWrappedMount(<MovieDetails />, {path: '/:id', route: `/${id}`})

    cy.wait('@networkErr').its('response.body.error.error').should('eq', error)

    cy.contains(error)
  })
})
