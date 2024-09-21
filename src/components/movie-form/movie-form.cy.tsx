import {generateMovie} from '../../../cypress/support/factories'
import MovieForm from './movie-form'
import spok from 'cy-spok'

describe('<MovieForm />', () => {
  const fillYear = (year: number) =>
    cy
      .getByCy('movie-input-comp-number')
      .clear()
      .type(`${year}backspace}`, {delay: 0})

  const fillName = (name: string) =>
    cy.getByCy('movie-input-comp-text').type(name, {delay: 0})

  it('should fill the form and add the movie', () => {
    const {name, year} = generateMovie()
    cy.wrappedMount(<MovieForm />)
    fillName(name)
    fillYear(year)

    cy.intercept('POST', '/movies', {statusCode: 200, delay: 50}).as('addMovie')
    cy.getByCy('add-movie-button').contains('Add Movie').click()
    cy.getByCy('add-movie-button').contains('Adding...')

    cy.wait('@addMovie')
      .its('request')
      .should(
        spok({
          body: {
            name,
            year: spok.number, // for some reason, a direct value verification only sometimes works
          },
        }),
      )

    cy.log('**check the form reset**')
    cy.getByCy('movie-input-comp-text').should('have.value', '')
    cy.getByCy('movie-input-comp-number').should('have.value', 2023)
  })

  it('should exercise validation errors', () => {
    cy.wrappedMount(<MovieForm />)

    fillYear(2025)
    cy.getByCy('add-movie-button').click()
    cy.getByCy('validation-error').should('have.length', 2)

    fillYear(1899)
    cy.getByCy('add-movie-button').click()

    cy.intercept('POST', '/movies', {statusCode: 200})
    fillYear(2024)
    fillName('4')
    cy.getByCy('add-movie-button').click()
    cy.getByCy('validation-error').should('not.exist')

    fillYear(1900)
    fillName('4')
    cy.getByCy('add-movie-button').click()
    cy.getByCy('validation-error').should('not.exist')
  })
})
