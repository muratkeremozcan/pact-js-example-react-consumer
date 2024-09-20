import MovieItem from './movie-item'

describe('<MovieItem />', () => {
  it('should verify the movie and delete', () => {
    cy.mount(
      <MovieItem
        id={3}
        name={'my movie'}
        year={2023}
        onDelete={cy.stub().as('onDelete')}
      />,
    )

    cy.getByCy('movie-item-comp').contains('my movie (2023)')

    cy.getByCy('delete-movie-item').click()
    cy.get('@onDelete').should('have.been.calledOnce')
  })
})
