import App from './App'
import './index.css'

describe('CT sanity', () => {
  it('passes sanity', () => {
    cy.mount(<App />)
    cy.contains('Movie List')
  })
})
