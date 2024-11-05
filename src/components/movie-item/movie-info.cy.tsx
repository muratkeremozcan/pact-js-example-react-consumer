import MovieInfo from './movie-info'

describe('<MovieInfo />', () => {
  it('should verify the movie and delete', () => {
    const id = 1
    const name = 'Inception'
    const year = 2010
    const rating = 8.5
    const director = 'Christopher Nolan'
    const movie = {id, name, year, rating, director}
    // const props = {movie}
    // cy.mount(<MovieInfo {...props} />)
    cy.mount(<MovieInfo movie={movie} />)

    cy.contains(id)
    cy.contains(name)
    cy.contains(year)
    cy.contains(rating).should('be.visible')
  })
})
