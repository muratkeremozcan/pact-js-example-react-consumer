import type {V3MockServer} from '@pact-foundation/pact'
import {MatchersV3, PactV4} from '@pact-foundation/pact'
import path from 'path'
import type {ErrorResponse, Movie} from './consumer'
import {
  addMovie,
  deleteMovieById,
  getMovies,
  getMovieById,
  getMovieByName,
  setApiUrl,
  updateMovie,
} from './consumer'
import {createProviderState, setJsonBody} from './test-helpers/helpers'
import type {
  DeleteMovieResponse,
  GetMovieResponse,
  MovieNotFoundResponse,
} from './provider-schema/movie-types'

// full list of matchers:
// https://docs.pact.io/implementation_guides/javascript/docs/matching#v3-matching-rules
const {like, eachLike, integer, decimal, string} = MatchersV3

// 1) Setup the mock provider for the consumer
// 2) Register the consumer's expectations against the (mock) provider
// 3) Call the consumer against the mock provider
// 4) Verify the consumer test and generate the contract

// 1) Setup the mock provider for the consumer
const pact = new PactV4({
  dir: path.resolve(process.cwd(), 'pacts'),
  consumer: 'ReactConsumer',
  provider: 'MoviesAPI-bi-directional',
  // logLevel: 'debug'
})

describe('Movies API', () => {
  const movieWithId: Movie = {
    id: 1,
    name: 'My movie',
    year: 1999,
    rating: 8.5,
    director: 'John Doe',
  }
  const testId = 100
  const movieWithTestId100: Movie = {
    id: testId,
    name: 'My movie',
    year: 1999,
    rating: 8.5,
    director: 'John Doe',
  }
  const movieWithoutId: Omit<Movie, 'id'> = {
    name: 'New movie',
    year: 1999,
    rating: 8.5,
    director: 'John Doe',
  }

  const propMatcherNoId = (movieEntity: Movie | Omit<Movie, 'id'>) => ({
    name: string(movieEntity.name),
    year: integer(movieEntity.year),
    rating: decimal(movieEntity.rating),
    director: string(movieEntity.director),
  })

  describe('When a GET request is made to /movies', () => {
    it('should return all movies', async () => {
      // we want to ensure at least 1 movie is returned in the array of movies
      const [stateName, stateParams] = createProviderState({
        name: 'An existing movie exists',
        params: movieWithId,
      })

      // 2) Register the consumer's expectations against the (mock) provider
      await pact
        .addInteraction()
        .given(stateName, stateParams)
        .uponReceiving('a request to get all movies')
        .withRequest('GET', '/movies')
        .willRespondWith(
          200,
          setJsonBody({
            status: 200,
            data: eachLike(movieWithId),
          }),
        )
        .executeTest(async (mockServer: V3MockServer) => {
          // Override the API URL to point to the mock server
          setApiUrl(mockServer.url)
          const res = await getMovies()
          // 4) Verify the consumer test and generate the contract
          expect(res.data).toEqual([movieWithId])
        })
    })

    it('should return empty when no movies exist', async () => {
      const noMovies: Movie[] = []

      await pact
        .addInteraction()
        .given('No movies exist')
        .uponReceiving('a request to get all movies')
        .withRequest('GET', '/movies')
        .willRespondWith(200, setJsonBody({status: 200, data: like(noMovies)}))
        .executeTest(async (mockServer: V3MockServer) => {
          setApiUrl(mockServer.url)
          const res = await getMovies()
          expect(res.data).toEqual(noMovies)
        })
    })

    it('should return a movie by name when requested with query parameters', async () => {
      // we want to ensure at least 1 movie is returned in the array of movies
      const [stateName, stateParams] = createProviderState({
        name: 'An existing movie exists',
        params: movieWithId,
      })

      await pact
        .addInteraction()
        .given(stateName, stateParams)
        .uponReceiving('a request to get a movie by name')
        .withRequest('GET', '/movies', builder => {
          builder.query({name: movieWithId.name}) // Use query to specify query parameters
        })
        .willRespondWith(
          200,
          setJsonBody({
            status: 200,
            data: {
              id: integer(movieWithId.id),
              ...propMatcherNoId(movieWithId),
            },
          }),
        )
        .executeTest(async (mockServer: V3MockServer) => {
          setApiUrl(mockServer.url)
          const res = (await getMovieByName(
            movieWithId.name,
          )) as GetMovieResponse
          expect(res.data).toEqual(movieWithId)
        })
    })
  })

  // PROVIDER STATES: we can simulate certain states of the api (like an empty or non-empty db)
  // in order to cover different scenarios
  // the state could have many more variables; it is a good practice to represent it as an object
  // note that the consumer state name should match the provider side

  // * The purpose of the stateHandlers is to ensure that the provider is in the correct state
  // to fulfill the consumer's expectations as defined in the contract tests.
  // * In a real-world scenario, you would typically set up this state by interacting with your service's database
  // * or through an API provided by the service itself (locally).
  // * This ensures that the provider test runs in a controlled environment where all the necessary data
  // and conditions are met, allowing for accurate verification of the consumer's expectations.
  describe('When a GET request is made to a specific movie ID', () => {
    it('should return a specific movie', async () => {
      const [stateName, stateParams] = createProviderState({
        name: 'Has a movie with a specific ID',
        params: {id: testId},
      })

      await pact
        .addInteraction()
        .given(stateName, stateParams)
        .uponReceiving('a request to a specific movie')
        .withRequest('GET', `/movies/${testId}`)
        .willRespondWith(
          200,
          setJsonBody({
            status: 200,
            data: {
              id: integer(testId),
              ...propMatcherNoId(movieWithTestId100),
            },
          }),
        )
        .executeTest(async (mockServer: V3MockServer) => {
          // Override the API URL to point to the mock server
          setApiUrl(mockServer.url)
          const res = (await getMovieById(testId)) as GetMovieResponse
          expect(res.data).toEqual(movieWithTestId100)
        })
    })
  })

  describe('When a POST request is made to /movies', () => {
    it('should add a new movie', async () => {
      await pact
        .addInteraction()
        .given('No movies exist')
        .uponReceiving('a request to add a new movie')
        .withRequest('POST', '/movies', setJsonBody(movieWithoutId))
        .willRespondWith(
          200,
          setJsonBody({
            status: 200,
            data: {
              id: integer(), // if the example value is omitted, a random number is used
              ...propMatcherNoId(movieWithoutId),
            },
          }),
        )
        .executeTest(async (mockServer: V3MockServer) => {
          // Override the API URL to point to the mock server
          setApiUrl(mockServer.url)
          const res = await addMovie(movieWithoutId)
          expect(res).toEqual({
            status: 200,
            data: {
              id: expect.any(Number),
              name: movieWithoutId.name,
              year: movieWithoutId.year,
              rating: movieWithoutId.rating,
              director: movieWithoutId.director,
            },
          })
        })
    })

    it('should not add a movie that already exists', async () => {
      const errorRes: ErrorResponse = {
        error: `Movie ${movieWithoutId.name} already exists`,
      }

      const [stateName, stateParams] = createProviderState({
        name: 'An existing movie exists',
        params: movieWithoutId,
      })

      await pact
        .addInteraction()
        .given(stateName, stateParams)
        .uponReceiving('a request to the existing movie')
        .withRequest('POST', '/movies', setJsonBody({...movieWithoutId}))
        .willRespondWith(409, setJsonBody(errorRes))
        .executeTest(async (mockServer: V3MockServer) => {
          // Override the API URL to point to the mock server
          setApiUrl(mockServer.url)
          const res = await addMovie(movieWithoutId)
          expect(res).toEqual(errorRes)
        })
    })
  })

  describe('When a PUT request is made to a specific movie ID', () => {
    it('should update an existing movie', async () => {
      const testId = 99
      const updatedMovieData = {
        name: 'Updated movie',
        year: 2000,
        rating: 8.5,
        director: 'Steven Spielberg',
      }

      const [stateName, stateParams] = createProviderState({
        name: 'Has a movie with a specific ID',
        params: {id: testId},
      })

      await pact
        .addInteraction()
        .given(stateName, stateParams)
        .uponReceiving('a request to update a specific movie')
        .withRequest('PUT', `/movies/${testId}`, setJsonBody(updatedMovieData))
        .willRespondWith(
          200,
          setJsonBody({
            status: 200,
            data: {
              id: integer(testId),
              ...propMatcherNoId(updatedMovieData),
            },
          }),
        )
        .executeTest(async (mockServer: V3MockServer) => {
          // Override the API URL to point to the mock server
          setApiUrl(mockServer.url)

          const res = await updateMovie(testId, updatedMovieData)

          expect(res).toEqual({
            status: 200,
            data: {
              id: testId,
              name: updatedMovieData.name,
              year: updatedMovieData.year,
              rating: updatedMovieData.rating,
              director: updatedMovieData.director,
            },
          })
        })
    })
  })

  describe('When a DELETE request is made to /movies', () => {
    it('should delete an existing movie successfully', async () => {
      const testId = 200
      const message = `Movie ${testId} has been deleted`

      const state = createProviderState({
        name: 'Has a movie with a specific ID',
        params: {id: testId},
      })

      await pact
        .addInteraction()
        .given(...state)
        .uponReceiving('a request to delete a movie that exists')
        .withRequest('DELETE', `/movies/${testId}`)
        .willRespondWith(200, setJsonBody({status: 200, message}))
        .executeTest(async (mockServer: V3MockServer) => {
          // Override the API URL to point to the mock server
          setApiUrl(mockServer.url)
          const res = (await deleteMovieById(testId)) as DeleteMovieResponse
          expect(res.message).toEqual(message)
        })
    })

    it('should throw an error if movie to delete does not exist', async () => {
      const testId = 123456789
      const error = `Movie with ID ${testId} not found`

      await pact
        .addInteraction()
        .uponReceiving('a request to delete a non-existing movie')
        .withRequest('DELETE', `/movies/${testId}`)
        .willRespondWith(404, setJsonBody({error, status: 404}))
        .executeTest(async (mockServer: V3MockServer) => {
          // Override the API URL to point to the mock server
          setApiUrl(mockServer.url)
          const res = (await deleteMovieById(testId)) as MovieNotFoundResponse
          expect(res.error).toEqual(error)
        })
    })
  })
})
