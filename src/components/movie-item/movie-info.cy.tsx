import MovieInfo from './movie-info'

describe('<MovieInfo />', () => {
  it('should', () => {
    const id = 1
    const name = 'Inception'
    const year = 2010
    const props = {
      movie: {
        id,
        name,
        year,
      },
    }
    cy.wrappedMount(<MovieInfo {...props} />)

    cy.contains(id)
    cy.contains(name)
    cy.contains(year).should('be.visible')
  })
})
