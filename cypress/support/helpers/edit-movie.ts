export const editMovie = (
  editedName: string,
  editedYear: number,
  editedRating: number,
  editedDirector: string,
) => {
  cy.getByCy('edit-movie').click()
  cy.getByCy('movie-edit-form-comp').within(() => {
    cy.get('[placeholder="Movie name"]').clear().type(editedName)
    cy.get('[placeholder="Movie year"]')
      .clear()
      .type(`${editedYear}{backspace}`)
    cy.get('[placeholder="Movie rating"]').clear().type(`${editedRating}`)
    cy.get('[placeholder="Movie director"]').clear().type(editedDirector)

    cy.getByCy('update-movie').click()
  })
}
