import '@cypress/skip-test/support'
import {generateMovie} from '@support/factories'
import {retryableBefore} from '@support/retryable-before'
import spok from 'cy-spok'

describe('movie crud e2e', () => {
  retryableBefore(() => {
    // skip in CI, for sure the server is not running
    cy.task('isCi').then(val => cy.skipOn(val === true))
    // when local, skip if the server is not running
    cy.exec(`curl -s -o /dev/null -w "%{http_code}" ${Cypress.env('apiUrl')}`, {
      failOnNonZeroExit: false,
    }).then(res => cy.skipOn(res.stdout !== '200'))
  })

  it('should add and delete a movie', () => {
    cy.intercept('GET', '/movies').as('getMovies')
    cy.visit('/')
    cy.contains('Movie List')
    cy.wait('@getMovies')
      .its('response.statusCode')
      .should('be.within', 200, 399)

    cy.log('**add a movie**')
    const {name, year} = generateMovie()
    cy.getByCy('movie-input-comp-text').type(name)
    cy.getByCy('movie-input-comp-number').clear().type(`${year}{backspace}`)

    cy.intercept('POST', '/movies').as('addMovie')
    cy.getByCy('add-movie-button').click()
    cy.wait('@addMovie')
      .its('response')
      .should(
        spok({
          statusCode: 200,
          body: {
            movie: {
              id: spok.number,
              name,
              year: spok.number,
            },
          },
        }),
      )

    cy.log('**delete a movie**')
    cy.intercept('DELETE', '/movies/*').as('deleteMovieById')
    cy.getByCy(`delete-movie-${name}`).click()
    cy.wait('@deleteMovieById')
    cy.getByCy(`delete-movie-${name}`).should('not.exist')
  })
})
