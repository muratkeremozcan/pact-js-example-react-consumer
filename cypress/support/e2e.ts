import './commands'
import 'cypress-map'
import '@bahmutov/cy-api'
import type {Movie} from '../../src/consumer'

const apiUrl = Cypress.config('baseUrl') || 'http://localhost:3000'

Cypress.Commands.add('getAllMovies', (url = apiUrl) => {
  cy.log('**getAllMovies**')
  return cy.task('fetchMovies', url)
})

Cypress.Commands.add('getMovieById', (id: number, url = apiUrl) => {
  cy.log(`**getMovieById: ${id}**`)
  return cy.task('fetchSingleMovie', {url, id}) // Pass an object with `url` and `id`
})

Cypress.Commands.add('addMovie', (body: Omit<Movie, 'id'>, url = apiUrl) => {
  cy.log('**addMovie**')
  return cy.task('addNewMovie', {
    url,
    movieName: body.name,
    movieYear: body.year,
  })
})

Cypress.Commands.add('deleteMovie', (id: number, url = apiUrl) => {
  cy.log('**deleteMovie by id: ${id}**')
  return cy.task('deleteMovie', {url, id})
})
