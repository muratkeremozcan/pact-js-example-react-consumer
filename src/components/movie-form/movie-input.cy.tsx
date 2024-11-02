import {generateMovie} from '../../../cypress/support/factories'
import MovieInput from './movie-input'
import spok from 'cy-spok'

describe('<MovieInput />', () => {
  const movie = generateMovie()
  it('should render a name input', () => {
    const {name} = movie

    cy.mount(
      <MovieInput
        type="text"
        value={name}
        placeholder="place holder"
        onChange={cy.stub().as('onChange')}
      />,
    )

    cy.getByCy('movie-input-comp-text')
      .should('have.value', name)
      .should('have.attr', 'placeholder', 'place holder')
    cy.getByCy('movie-input-comp-text').type('a')

    // different ways of checking the call
    // 1
    cy.get('@onChange')
      .tap()
      .should('have.been.calledOnce')
      .its('firstCall.args.0.nativeEvent.data')
      .should('eq', 'a')

    // 2
    cy.get('@onChange').should('have.been.calledWithMatch', {
      nativeEvent: {data: 'a'},
    })

    // 3
    cy.get('@onChange')
      .invoke('getCalls')
      .map('args')
      .should(
        spok([
          [
            {
              nativeEvent: {data: 'a'},
            },
          ],
        ]),
      )
  })

  it('should render a year input', () => {
    const {year} = movie

    cy.mount(
      <MovieInput
        type="number"
        value={year}
        placeholder="place holder"
        onChange={cy.stub().as('onChange')}
      />,
    )

    cy.getByCy('movie-input-comp-number').should('have.value', year)
    cy.getByCy('movie-input-comp-number').type('1')

    cy.get('@onChange').should('have.been.calledWithMatch', {
      nativeEvent: {data: '1'},
    })
  })
})
