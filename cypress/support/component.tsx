// put CT-only commands here

import ErrorComponent from '@components/error-component'
import LoadingMessage from '@components/loading-message'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import type {MountOptions} from 'cypress/react'
import {mount} from 'cypress/react'
import {Suspense} from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import {MemoryRouter, Routes, Route} from 'react-router-dom'
import './commands'

Cypress.Commands.add('mount', mount)

const wrappedMount = (WrappedComponent: React.ReactNode, options = {}) => {
  const wrapped = (
    <QueryClientProvider client={new QueryClient()}>
      <ErrorBoundary fallback={<ErrorComponent />}>
        <Suspense fallback={<LoadingMessage />}>{WrappedComponent}</Suspense>
      </ErrorBoundary>
    </QueryClientProvider>
  )
  return mount(wrapped, options)
}
Cypress.Commands.add('wrappedMount', wrappedMount)

const routeWrappedMount = (
  WrappedComponent: React.ReactNode,
  options?: {
    route?: string
    path?: string
    cypressOptions?: MountOptions
  },
) => {
  const {route = '/', path = '/', cypressOptions = {}} = options || {}
  window.history.pushState({}, 'Test Page', route)

  const routerWrappedComp = (
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route element={WrappedComponent} path={path} />
      </Routes>
    </MemoryRouter>
  )
  // compose into wrappedMount
  return wrappedMount(routerWrappedComp, cypressOptions)
}
Cypress.Commands.add('routeWrappedMount', routeWrappedMount)
