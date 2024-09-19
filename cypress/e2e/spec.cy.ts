describe('e2e sanity', () => {
  it('passes sanity', () => {
    cy.visit('/')
    cy.contains('Movie List')
    cy.contains('1976')
  })
})
