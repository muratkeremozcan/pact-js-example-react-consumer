export const editMovie = (
  editedName: string,
  editedYear: number,
  editedRating: number,
) => {
  cy.getByCy('edit-movie').click()
  cy.getByCy('movie-edit-form-comp').within(() => {
    cy.getByCy('movie-input-comp-text').clear().type(editedName)
    cy.get('[placeholder="Movie rating"]')
      .clear()
      .type(`${editedYear}{backspace}`)
    cy.get('[placeholder="Movie rating"]').clear().type(`${editedRating}`)
    cy.getByCy('update-movie').click()
  })
}
