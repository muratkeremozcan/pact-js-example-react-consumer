import {generateMovie} from '@support/factories'
import MovieList from './movie-list'

describe('<MovieList />', () => {
  it('should verify the movie and delete', () => {
    const movie1 = {id: 1, ...generateMovie()}
    const movie2 = {id: 2, ...generateMovie()}
    cy.routeWrappedMount(
      <MovieList
        movies={[movie1, movie2]}
        onDelete={cy.stub().as('onDelete')}
      />,
    )

    cy.getByCy('movie-list-comp').should('be.visible')
    cy.getByCy('movie-item-comp').should('have.length', 2)
  })

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
})
