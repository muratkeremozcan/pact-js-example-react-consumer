import {generateMovie} from '@support/factories'
import MovieList from './movie-list'

describe('<MovieList />', () => {
  it('should show nothing with no movies', () => {
    cy.routeWrappedMount(
      <MovieList movies={[]} onDelete={cy.stub().as('onDelete')} />,
    )

    cy.getByCy('movie-list-comp').should('not.exist')
  })

  it('should show error with error', () => {
    cy.routeWrappedMount(
      <MovieList
        movies={{error: 'boom'}}
        onDelete={cy.stub().as('onDelete')}
      />,
    )

    cy.getByCy('movie-list-comp').should('not.exist')
    cy.getByCy('error').should('be.visible')
  })

  it('should verify the movie and delete', () => {
    const movie1Id = 7
    const movie2Id = 42
    const movie1 = {id: movie1Id, ...generateMovie()}
    const movie2 = {id: movie2Id, ...generateMovie()}

    cy.routeWrappedMount(
      <MovieList
        movies={[movie1, movie2]}
        onDelete={cy.stub().as('onDelete')}
      />,
    )

    cy.getByCy('movie-list-comp').should('be.visible')
    cy.getByCy('movie-item-comp').should('have.length', 2)

    cy.getByCy(`delete-movie-${movie1.name}`).click()
    cy.getByCy(`delete-movie-${movie2.name}`).click()
    cy.get('@onDelete').should('be.calledTwice')
    cy.get('@onDelete').its('callCount').should('eq', 2) // same thing
    cy.get('@onDelete').should('be.calledWith', movie1Id)
    cy.get('@onDelete').should('be.calledWith', movie2Id)
  })
})
