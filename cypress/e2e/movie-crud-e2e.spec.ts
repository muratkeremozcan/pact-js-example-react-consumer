import '@cypress/skip-test/support'
import {generateMovie} from '@support/factories'
import {editMovie} from '@support/helpers/edit-movie'
import spok from 'cy-spok'

describe('movie crud e2e', () => {
  before(() => {
    // skip in CI, for sure the server is not running
    cy.task('isCi').then(val => cy.skipOn(val === true))
    // when local, skip if the server is not running
    cy.exec(
      `curl -s -o /dev/null -w "%{http_code}" ${Cypress.env('VITE_API_URL')}`,
      {
        failOnNonZeroExit: false,
      },
    ).then(res => cy.skipOn(res.stdout !== '200'))
  })

  beforeEach(() => {
    cy.intercept('GET', '/movies').as('getMovies')
    cy.visit('/')
    cy.contains('Movie List')
    cy.wait('@getMovies')
      .its('response.statusCode')
      .should('be.within', 200, 399)
  })

  it('should add and delete a movie from movie list', () => {
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
            data: {
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

  it('should update and delete a movie at movie manager', () => {
    const {name, year} = generateMovie()
    const {name: editedName, year: editedYear} = generateMovie()

    cy.addMovie({name, year})
      .its('body.data.id')
      .then(id => {
        cy.log('**direct-nav by id**')

        cy.visit(`/movies/${id}`)

        editMovie(editedName, editedYear)

        cy.log('**check on the movie list**')
        cy.getByCy('back').click()
        cy.location('pathname').should('eq', '/movies')
        cy.contains(editedName)

        cy.visit(`/movies/${id}`)
        cy.getByCy('delete-movie').click()

        cy.contains(editedName).should('not.exist')
      })
  })
})
