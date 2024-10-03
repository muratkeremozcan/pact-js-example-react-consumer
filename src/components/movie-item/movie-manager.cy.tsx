import type {MovieManagerProps} from './movie-manager'
import MovieManager from './movie-manager'

describe('<MovieManager />', () => {
  const id = 1
  const name = 'Inception'
  const year = 2010

  it('should toggle between movie info and movie edit components', () => {
    const props: MovieManagerProps = {
      movie: {
        id,
        name,
        year,
      },
      onDelete: cy.stub().as('onDelete'),
    }
    cy.wrappedMount(<MovieManager {...props} />)

    cy.getByCy('delete-movie').click()
    cy.get('@onDelete').should('have.been.calledOnce')

    cy.getByCy('movie-info-comp').should('be.visible')
    cy.getByCy('movie-edit-form-comp').should('not.exist')

    cy.getByCy('edit-movie').click()
    cy.getByCy('movie-info-comp').should('not.exist')
    cy.getByCy('movie-edit-form-comp').should('be.visible')
  })
})
