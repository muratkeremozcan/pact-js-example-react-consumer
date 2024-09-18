/* eslint-disable @typescript-eslint/no-explicit-any */
import {MountOptions, MountReturn} from 'cypress/react'

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

      /** Gets a list of movies
       * ```js
       * cy.getAllMovies()
       * ```
       */
      getAllMovies(url?: string): Chainable<Response<Movie[]> & Messages>

      /** Gets a movie by id
       * ```js
       * cy.getMovieById(1)
       * ```
       */
      getMovieById(
        id: number,
        url?: string,
      ): Chainable<Response<Movie> & Messages>

      /** Creates a movie
       * ```js
       * cy.addMovie({name: 'The Great Gatsby', year: 1925  })
       * ```
       */
      addMovie(
        body: Omit<Movie, 'id'>,
        url?: string,
      ): Chainable<Response<Omit<Movie, 'id'>> & Messages>

      /** Deletes a movie
       * ```js
       * cy.deleteMovie(1)
       * ```
       */
      deleteMovie(
        id: number,
        url?: string,
      ): Chainable<Response<Movie> & Messages>
    }
  }
}
