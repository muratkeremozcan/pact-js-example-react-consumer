import MovieItem from './movie-item'

describe('<MovieItem />', () => {
  it('should verify the movie and delete', () => {
    cy.routeWrappedMount(
      <MovieItem
        id={3}
        name={'my movie'}
        year={2023}
        onDelete={cy.stub().as('onDelete')}
      />,
    )

    cy.getByCy('movie-item-comp')
      .contains('my movie (2023)')
      .should('have.attr', 'href', '/movies/3')

    cy.getByCyLike('delete-movie').click()
    cy.get('@onDelete').should('have.been.calledOnce')
  })
})
