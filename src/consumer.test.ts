import nock, {cleanAll} from 'nock'
import {
  fetchMovies,
  fetchSingleMovie,
  addNewMovie,
  deleteMovie,
} from './consumer'
import type {Movie, ErrorResponse, SuccessResponse} from './consumer'

// Nock can be used to test modules that make HTTP requests to external APIs in isolation.
// For example, if a module sends HTTP requests to an external API, you can test that module independently of the actual API.

// Nock can be used to test modules that make HTTP requests to external APIs in isolation.
// For example, if a module sends HTTP requests to an external API, you can test that module independently of the actual API.
/*
Key differences between Nock and Pact:

1) **Error handling**:
   - **Nock**: You can and should cover error scenarios in your code, regardless of the provider's actual behavior.
   - **Pact**: You cover error scenarios only if it is important for your consumer contract.

2) **Provider states**:
   - **Nock**: There are no provider states, as Nock focuses on testing in isolation without interacting with the provider.
   - **Pact**: Introduces provider states, enabling you to simulate various conditions (e.g., empty or non-empty databases) 
	 and verify contracts by running tests directly against the provider (at the provider repo, while locally serving the provider).

3) **Response flexibility**:
   - **Nock**: Mocked responses must be concrete and predefined.
   - **Pact**: Allows for loose matchers, enabling more flexibility by focusing on the shape of the data rather than exact values.
*/

const MOCKSERVER_URL = 'http://mockserver.com'

describe('Consumer API functions', () => {
  afterEach(() => {
    cleanAll()
  })

  describe('fetchMovies', () => {
    // this is 1:1 with the pacttest version
    it('should return all movies', async () => {
      const EXPECTED_BODY: Movie = {
        id: 1,
        name: 'My movie',
        year: 1999,
      }

      nock(MOCKSERVER_URL).get('/movies').reply(200, [EXPECTED_BODY])

      const res = (await fetchMovies(MOCKSERVER_URL)) as Movie[]
      expect(res[0]).toEqual(EXPECTED_BODY)
    })

    // a key difference in nock vs pact is covering the error cases in our code
    // in reality, the provider never errors; it just returns an empty array,
    // but our code can handle an error, so we can test it...
    it('should handle errors correctly', async () => {
      const errorRes: ErrorResponse = {error: 'Not found'}
      nock(MOCKSERVER_URL).get('/movies').reply(404, errorRes)

      const res = await fetchMovies(MOCKSERVER_URL)
      expect(res).toEqual(errorRes)
    })
  })

  describe('fetchSingleMovie', () => {
    // this is similar to its pacttest version
    // a key difference in pact is using provider states, to fully simulate the provider side
    // in nock, we are not concerned with running our tests against the provider...
    it('should return a specific movie', async () => {
      const EXPECTED_BODY: Movie = {
        id: 1,
        name: 'My movie',
        year: 1999,
      }

      // in pact the provider state would be specified here
      nock(MOCKSERVER_URL).get('/movie/1').reply(200, EXPECTED_BODY)

      const res = await fetchSingleMovie(MOCKSERVER_URL, 1)
      expect(res).toEqual(EXPECTED_BODY)
    })

    it('should handle errors when movie not found', async () => {
      const testId = 999
      const errorRes: ErrorResponse = {error: 'Movie not found'}
      nock(MOCKSERVER_URL).get(`/movie/${testId}`).reply(404, errorRes)

      const result = await fetchSingleMovie(MOCKSERVER_URL, testId)
      expect(result).toEqual(errorRes)
    })
  })

  describe('addNewMovie', () => {
    // this is similar to its pacttest version
    it('should add a new movie', async () => {
      const {name, year}: Omit<Movie, 'id'> = {
        name: 'New movie',
        year: 1999,
      }
      // with pact we can keep the response generic
      // with nock it has to be concrete response
      nock(MOCKSERVER_URL).post('/movies', {name, year}).reply(200, {
        id: 1,
        name,
        year,
      })

      const res = await addNewMovie(MOCKSERVER_URL, name, year)
      expect(res).toEqual({
        id: expect.any(Number),
        name,
        year,
      })
    })

    // this is similar to its pacttest version
    // a key difference in pact is using provider states, to fully simulate the provider side
    it('should not add a movie that already exists', async () => {
      const movie: Omit<Movie, 'id'> = {
        name: 'My existing movie',
        year: 2001,
      }
      const errorRes: ErrorResponse = {
        error: `Movie ${movie.name} already exists`,
      }

      // in pact the provider state would be specified here
      nock(MOCKSERVER_URL).post('/movies', movie).reply(409, errorRes)

      const res = await addNewMovie(MOCKSERVER_URL, movie.name, movie.year)
      expect(res).toEqual(errorRes)
    })
  })

  describe('deleteMovie', () => {
    // this is similar to its pacttest version
    // a key difference in pact is using provider states, to fully simulate the provider side
    it('should delete an existing movie successfully', async () => {
      const testId = 100
      const successRes: SuccessResponse = {
        message: `Movie ${testId} has been deleted`,
      }

      // in pact the provider state would be specified here
      nock(MOCKSERVER_URL).delete(`/movie/${testId}`).reply(200, successRes)

      const res = await deleteMovie(MOCKSERVER_URL, testId)
      expect(res).toEqual(successRes)
    })

    it('should throw an error if movie to delete does not exist', async () => {
      const testId = 123456789
      const errorRes: ErrorResponse = {
        error: `Movie ${testId} not found`,
      }

      // in pact the provider state would be specified here
      nock(MOCKSERVER_URL).delete(`/movie/${testId}`).reply(404, errorRes)

      const res = await deleteMovie(MOCKSERVER_URL, testId)
      expect(res).toEqual(errorRes)
    })
  })
})
