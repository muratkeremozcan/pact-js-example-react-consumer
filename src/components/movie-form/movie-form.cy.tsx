import {generateMovie} from '../../../cypress/support/factories'
import MovieForm from './movie-form'
import spok from 'cy-spok'

describe('<MovieForm />', () => {
  const getByPlaceHolder = (placeholder: string) =>
    cy.get(`[placeholder="${placeholder}"]`)

  const fillYear = (year: number) =>
    getByPlaceHolder('Movie year')
      .clear({force: true})
      .type(`${year}{backspace}`, {delay: 0})

  const fillName = (name: string) =>
    getByPlaceHolder('Movie name').type(name, {delay: 0})

  const fillRating = (rating: number) =>
    getByPlaceHolder('Movie rating')
      .clear({force: true})
      .type(`${rating}`, {delay: 0})

  const fillDirector = (director: string) =>
    getByPlaceHolder('Movie director').type(director, {delay: 0})

  it('should fill the form and add the movie', () => {
    const {name, year, rating, director} = generateMovie()
    cy.wrappedMount(<MovieForm />)
    fillName(name)
    fillYear(year)
    fillRating(rating)
    fillDirector(director)

    cy.intercept('POST', '/movies', {statusCode: 200, delay: 50}).as('addMovie')
    cy.getByCy('add-movie-button').contains('Add Movie').click()
    cy.getByCy('add-movie-button').contains('Adding...')

    cy.wait('@addMovie')
      .its('request.body')
      .should(
        spok({
          name,
          year: spok.number,
        }),
      )

    cy.log('**check the form reset**')
    getByPlaceHolder('Movie name').should('have.value', '')
    getByPlaceHolder('Movie year').should('have.value', 2023)
    getByPlaceHolder('Movie rating').should('have.value', 0)
  })

  it('should exercise validation errors', () => {
    cy.wrappedMount(<MovieForm />)

    fillYear(2025)
    cy.getByCy('add-movie-button').click()
    cy.getByCy('validation-error').should('have.length', 2)

    fillYear(1899)
    cy.getByCy('add-movie-button').click()
    cy.getByCy('validation-error').should('have.length', 3)

    fillYear(2024)
    fillName('4')
    fillDirector('Christopher Nolan')
    cy.getByCy('add-movie-button').click()
    cy.getByCy('validation-error').should('not.exist')

    fillYear(1900)
    fillName('4')
    fillDirector('Christopher Nolan')
    cy.getByCy('add-movie-button').click()
    cy.getByCy('validation-error').should('not.exist')
  })
})
