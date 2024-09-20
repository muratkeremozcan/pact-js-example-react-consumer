import {generateMovie} from '../../../cypress/support/factories'
import MovieList from './movie-list'

describe('<MovieList />', () => {
  it('should verify the movie and delete', () => {
    const movie1 = {id: 1, ...generateMovie()}
    const movie2 = {id: 2, ...generateMovie()}
    cy.mount(
      <MovieList
        movies={[movie1, movie2]}
        onDelete={cy.stub().as('onDelete')}
      />,
    )

    cy.getByCy('movie-list-comp').should('be.visible')
    cy.getByCy('movie-item-comp').should('have.length', 2)
  })
})
