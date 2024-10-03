export const editMovie = (editedName: string, editedYear: number) => {
  cy.getByCy('edit-movie').click()
  cy.getByCy('movie-edit-form-comp').within(() => {
    cy.getByCy('movie-input-comp-text').clear().type(editedName)
    cy.getByCy('movie-input-comp-number')
      .clear()
      .type(`${editedYear}{backspace}`)
    cy.getByCy('update-movie').click()
  })
}
