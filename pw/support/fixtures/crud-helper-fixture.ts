import type {Movie} from 'src/consumer'
import {test as baseApiRequestFixture} from './api-request-fixture'
import type {ApiRequestResponse} from './api-request-fixture'

const commonHeaders = (token: string) => ({
  Authorization: token,
})

//  Shared Types
type ServerResponse<T> = {
  status: number
  data: T
}

// Define each function signature as a type:
type AddMovieFn = (
  token: string,
  body: Omit<Movie, 'id'>,
  baseUrl?: string,
) => Promise<ApiRequestResponse<ServerResponse<Movie>>>

type GetAllMoviesFn = (
  token: string,
  baseUrl?: string,
) => Promise<ApiRequestResponse<ServerResponse<Movie[]>>>

type GetMovieByIdFn = (
  token: string,
  id: number,
  baseUrl?: string,
) => Promise<ApiRequestResponse<ServerResponse<Movie>>>

type GetMovieByNameFn = (
  token: string,
  name: string,
  baseUrl?: string,
) => Promise<ApiRequestResponse<ServerResponse<Movie[]>>>

type UpdateMovieFn = (
  token: string,
  id: number,
  body: Partial<Movie>,
  baseUrl?: string,
) => Promise<ApiRequestResponse<ServerResponse<Movie>>>

type DeleteMovieFn = (
  token: string,
  id: number,
  baseUrl?: string,
) => Promise<ApiRequestResponse<ServerResponse<void>>>

//  group them all together
type MovieApiMethods = {
  addMovie: AddMovieFn
  getAllMovies: GetAllMoviesFn
  getMovieById: GetMovieByIdFn
  getMovieByName: GetMovieByNameFn
  updateMovie: UpdateMovieFn
  deleteMovie: DeleteMovieFn
}

// Generic Type Extension
export const test = baseApiRequestFixture.extend<MovieApiMethods>({
  addMovie: async ({apiRequest}, use) => {
    const addMovieFn: AddMovieFn = async (token, body, baseUrl?) => {
      return apiRequest<ServerResponse<Movie>>({
        method: 'POST',
        url: '/movies',
        baseUrl,
        body,
        headers: commonHeaders(token),
      })
    }

    await use(addMovieFn)
  },

  // getAllMovies
  getAllMovies: async ({apiRequest}, use) => {
    const getAllMoviesFn: GetAllMoviesFn = (token, baseUrl?) => {
      return apiRequest<ServerResponse<Movie[]>>({
        method: 'GET',
        url: '/movies',
        baseUrl,
        headers: commonHeaders(token),
      })
    }
    await use(getAllMoviesFn)
  },

  // getMovieById
  getMovieById: async ({apiRequest}, use) => {
    const getMovieByIdFn: GetMovieByIdFn = async (token, id, baseUrl?) => {
      return apiRequest<ServerResponse<Movie>>({
        method: 'GET',
        url: `/movies/${id}`,
        baseUrl,
        headers: commonHeaders(token),
      })
    }
    await use(getMovieByIdFn)
  },

  getMovieByName: async ({apiRequest}, use) => {
    const getMovieByNameFn: GetMovieByNameFn = async (
      token,
      name,
      baseUrl?,
    ) => {
      const queryParams = new URLSearchParams({name}).toString()
      const url = `/movies?${queryParams}`

      return apiRequest<ServerResponse<Movie[]>>({
        method: 'GET',
        url,
        baseUrl,
        headers: commonHeaders(token),
      })
    }
    await use(getMovieByNameFn)
  },

  updateMovie: async ({apiRequest}, use) => {
    const updateMovieFn: UpdateMovieFn = (token, id, body, baseUrl?) => {
      return apiRequest<ServerResponse<Movie>>({
        method: 'PUT',
        url: `/movies/${id}`,
        baseUrl,
        body,
        headers: commonHeaders(token),
      })
    }
    await use(updateMovieFn)
  },

  deleteMovie: async ({apiRequest}, use) => {
    const deleteMovieFn: DeleteMovieFn = (token, id, baseUrl?) => {
      return apiRequest<ServerResponse<void>>({
        method: 'DELETE',
        url: `/movies/${id}`,
        baseUrl,
        headers: commonHeaders(token),
      })
    }
    await use(deleteMovieFn)
  },
})
