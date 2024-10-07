/* eslint-disable @typescript-eslint/no-explicit-any */
import {MountOptions, MountReturn} from 'cypress/react'
import type {Movie} from './src/consumer'

export {}
declare global {
  namespace Cypress {
    interface Chainable {
      /** Yields elements with a data-cy attribute that matches a specified selector.
       * ```
       * cy.getByCy('search-toggle') // where the selector is [data-cy="search-toggle"]
       * ```
       */
      getByCy(qaSelector: string, args?: any): Chainable<JQuery<HTMLElement>>

      /** Yields elements with data-cy attribute that partially matches a specified selector.
       * ```
       * cy.getByCyLike('chat-button') // where the selector is [data-cy="chat-button-start-a-new-claim"]
       * ```
       */
      getByCyLike(
        qaSelector: string,
        args?: any,
      ): Chainable<JQuery<HTMLElement>>

      /** Mounts a React node
       * @param component React Node to mount
       * @param options Additional options to pass into mount
       */
      mount(
        component: React.ReactNode,
        options?: MountOptions,
      ): Cypress.Chainable<MountReturn>

      /** Mounts the component wrapped by all the providers:
       * QueryClientProvider, ErrorBoundary, Suspense, BrowserRouter
       * @param component React Node to mount
       * @param options Additional options to pass into mount
       */
      wrappedMount(
        component: React.ReactNode,
        options?: MountOptions,
      ): Cypress.Chainable<MountReturn>

      /** Mounts a React node with the specified route and path
       * @param component React Node to mount
       * @param route Route of the component
       * @param path Path of the component
       * @param options Additional options to pass into mount */
      routeWrappedMount(
        component: React.ReactNode,
        options?: {
          route?: string
          path?: string
          cypressOptions?: MountOptions
        },
      ): Cypress.Chainable<MountReturn>

      /** https://www.npmjs.com/package/@cypress/skip-test
       * `cy.skipOn('localhost')` */
      skipOn(
        nameOrFlag: string | boolean | (() => boolean),
        cb?: () => void,
      ): Chainable<Subject>

      /** https://www.npmjs.com/package/@cypress/skip-test
       * `cy.onlyOn('localhost')` */
      onlyOn(
        nameOrFlag: string | boolean | (() => boolean),
        cb?: () => void,
      ): Chainable<Subject>

      /** Creates a movie
       * ```js
       * cy.addMovie({name: 'The Great Gatsby', year: 1925  })
       * ```
       */
      addMovie(
        body: Omit<Movie, 'id'>,
        allowedToFail?: boolean,
      ): Chainable<Response<Omit<Movie, 'id'>>>

      /**
       * If the token exists, reuses it
       * If no token is exists, gets a token
       */
      maybeGetToken(sessionName: string): Chainable<string>
    }
  }
}
