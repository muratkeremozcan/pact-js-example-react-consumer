import MovieManager from './movie-info'

describe('<MovieInfo />', () => {
  it('should', () => {
    const id = 1
    const name = 'Inception'
    const year = 2010
    const rating = 8.5
    const props = {
      movie: {
        id,
        name,
        year,
        rating,
      },
    }
    cy.mount(<MovieManager {...props} />)

    cy.contains(id)
    cy.contains(name)
    cy.contains(year).should('be.visible')
    cy.contains(rating).should('be.visible')
  })
})
