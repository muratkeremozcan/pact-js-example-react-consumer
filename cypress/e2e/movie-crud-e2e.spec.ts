import '@cypress/skip-test/support'
import {generateMovie} from '@support/factories'
import spok from 'cy-spok'

describe('movie crud e2e', () => {
  it('should add and delete a movie', () => {
    cy.task('isCi').then(val => cy.skipOn(val === true))
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
            id: spok.number,
            name,
            year: spok.number,
          },
        }),
      )

    cy.log('**delete a movie**')
    cy.intercept('DELETE', '/movie/*').as('deleteMovie')
    cy.getByCy(`delete-movie-${name}`).click()
    cy.wait('@deleteMovie')
    cy.getByCy(`delete-movie-${name}`).should('not.exist')
  })
})
