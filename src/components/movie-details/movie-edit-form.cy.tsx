import type {Movie} from 'src/consumer'
import MovieEditForm from './movie-edit-form'
import {generateMovie} from '@cypress/support/factories'
import spok from 'cy-spok'

describe('<MovieEditForm />', () => {
  const id = 7
  const movie: Movie = {id, ...generateMovie()}

  it('should cancel and submit a movie update', () => {
    cy.intercept('PUT', `/movies/${id}`, {status: 200}).as('updateMovie')

    cy.wrappedMount(
      <MovieEditForm movie={movie} onCancel={cy.stub().as('onCancel')} />,
    )

    cy.getByCy('cancel').click()
    cy.get('@onCancel').should('have.been.calledOnce')

    cy.getByCy('update-movie').click()

    cy.wait('@updateMovie')
      .its('request.body')
      .should(
        spok({
          name: movie.name,
          year: movie.year,
          rating: movie.rating,
          director: movie.director,
        }),
      )
  })
})
