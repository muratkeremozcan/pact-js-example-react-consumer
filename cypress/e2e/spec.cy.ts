describe('e2e sanity', () => {
  it('passes sanity', () => {
    cy.visit('/')
    cy.getByCy('count').contains('count is 0').dblclick().contains('count is 2')
    cy.task('log', 'e2e sanity passed')
  })
})
