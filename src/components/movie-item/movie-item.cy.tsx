import MovieItem from './movie-item'

describe('<MovieItem />', () => {
  it('should verify the movie and delete', () => {
    const id = 3
    cy.routeWrappedMount(
      <MovieItem
        id={id}
        name={'my movie'}
        year={2023}
        rating={8.5}
        director={'my director'}
        onDelete={cy.stub().as('onDelete')}
      />,
    )

    cy.getByCy('movie-item-comp')
      .contains('my movie (2023)')
      .should('have.attr', 'href', `/movies/${id}`)

    cy.getByCyLike('delete-movie').click()
    cy.get('@onDelete').should('have.been.calledOnce')
    cy.get('@onDelete').should('have.been.calledWith', id)
  })
})
