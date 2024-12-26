import {beforeMount} from '@playwright/experimental-ct-react/hooks'
import React, {Suspense} from 'react'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {ErrorBoundary} from 'react-error-boundary'
import {MemoryRouter, Routes, Route} from 'react-router-dom'
import ErrorComponent from '@components/error-component'
import LoadingMessage from '@components/loading-message'

// Initialize MSW browser worker here if needed
// Initialize any global styles or theme providers here

beforeMount(async ({App, hooksConfig}) => {
  // Get route configuration if provided
  const {route = '/', path = '/'} =
    (hooksConfig as {route?: string; path?: string}) || {}

  // Push the route to history
  window.history.pushState({}, 'Test Page', route)

  return (
    <QueryClientProvider client={new QueryClient()}>
      <ErrorBoundary fallback={<ErrorComponent />}>
        <Suspense fallback={<LoadingMessage />}>
          <MemoryRouter initialEntries={[route]}>
            <Routes>
              <Route element={<App />} path={path} />
            </Routes>
          </MemoryRouter>
        </Suspense>
      </ErrorBoundary>
    </QueryClientProvider>
  )
})
