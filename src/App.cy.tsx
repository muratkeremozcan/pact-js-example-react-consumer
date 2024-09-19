import App from './App'
import './index.css'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'

describe('CT sanity', () => {
  it('passes sanity', () => {
    cy.intercept('/movies', [{id: 1, name: 'Inception', year: 2010}])

    const queryClient = new QueryClient()
    cy.mount(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>,
    )

    cy.contains('Movie List')
  })
})
