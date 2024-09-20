// put CT-only commands here

import ErrorComponent from '@components/error-component'
import LoadingMessage from '@components/loading-message'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {mount} from 'cypress/react18'
import {Suspense} from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import './commands'

Cypress.Commands.add('mount', mount)

Cypress.Commands.add(
  'wrappedMount',
  (WrappedComponent: React.ReactNode, options = {}) => {
    const wrapped = (
      <QueryClientProvider client={new QueryClient()}>
        <ErrorBoundary fallback={<ErrorComponent />}>
          <Suspense fallback={<LoadingMessage />}>{WrappedComponent}</Suspense>
        </ErrorBoundary>
      </QueryClientProvider>
    )
    return cy.mount(wrapped, options)
  },
)
