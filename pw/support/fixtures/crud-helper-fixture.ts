import type {Movie} from 'src/consumer'
import {test as baseApiRequestFixture} from './api-request-fixture'
import type {ApiRequestResponse} from './api-request-fixture'

// Common headers function
const commonHeaders = (token: string) => ({
  Authorization: token,
})

// Define the ServerResponse type
export type ServerResponse<T> = {
  status: number
  data: T
}

export const test = baseApiRequestFixture.extend<{
  addMovie: (
    token: string,
    body: Omit<Movie, 'id'>,
    baseUrl?: string,
  ) => Promise<ApiRequestResponse<ServerResponse<Movie>>>
  getAllMovies: (
    token: string,
    baseUrl?: string,
  ) => Promise<ApiRequestResponse<ServerResponse<Movie[]>>>
  getMovieById: (
    token: string,
    id: number,
    baseUrl?: string,
  ) => Promise<ApiRequestResponse<ServerResponse<Movie>>>
  getMovieByName: (
    token: string,
    name: string,
    baseUrl?: string,
  ) => Promise<ApiRequestResponse<ServerResponse<Movie[]>>>
  updateMovie: (
    token: string,
    id: number,
    body: Partial<Movie>,
    baseUrl?: string,
  ) => Promise<ApiRequestResponse<ServerResponse<Movie>>>
  deleteMovie: (
    token: string,
    id: number,
    baseUrl?: string,
  ) => Promise<ApiRequestResponse<ServerResponse<void>>>
}>({
  addMovie: async ({apiRequest}, use) => {
    const addMovie = async (
      token: string,
      body: Omit<Movie, 'id'>,
      baseUrl?: string,
    ) => {
      return apiRequest<ServerResponse<Movie>>({
        method: 'POST',
        url: '/movies',
        baseUrl,
        body,
        headers: commonHeaders(token),
      })
    }

    await use(addMovie)
  },

  getAllMovies: async ({apiRequest}, use) => {
    const getAllMovies = async (token: string, baseUrl?: string) => {
      return apiRequest<ServerResponse<Movie[]>>({
        method: 'GET',
        url: '/movies',
        baseUrl,
        headers: commonHeaders(token),
      })
    }

    await use(getAllMovies)
  },

  getMovieById: async ({apiRequest}, use) => {
    const getMovieById = async (
      token: string,
      id: number,
      baseUrl?: string,
    ) => {
      return apiRequest<ServerResponse<Movie>>({
        method: 'GET',
        url: `/movies/${id}`,
        baseUrl,
        headers: commonHeaders(token),
      })
    }

    await use(getMovieById)
  },

  getMovieByName: async ({apiRequest}, use) => {
    const getMovieByName = async (
      token: string,
      name: string,
      baseUrl?: string,
    ) => {
      // Construct the query parameters manually
      const queryParams = new URLSearchParams({name}).toString()
      const url = `/movies?${queryParams}` // Append the query string to the endpoint

      return apiRequest<ServerResponse<Movie[]>>({
        method: 'GET',
        url, // Pass the constructed URL
        baseUrl,
        headers: commonHeaders(token),
      })
    }

    await use(getMovieByName)
  },

  updateMovie: async ({apiRequest}, use) => {
    const updateMovie = async (
      token: string,
      id: number,
      body: Partial<Movie>,
      baseUrl?: string,
    ) => {
      return apiRequest<ServerResponse<Movie>>({
        method: 'PUT',
        url: `/movies/${id}`,
        baseUrl,
        body,
        headers: commonHeaders(token),
      })
    }

    await use(updateMovie)
  },

  deleteMovie: async ({apiRequest}, use) => {
    const deleteMovie = async (token: string, id: number, baseUrl?: string) => {
      return apiRequest<ServerResponse<void>>({
        method: 'DELETE',
        url: `/movies/${id}`,
        baseUrl,
        headers: commonHeaders(token),
      })
    }

    await use(deleteMovie)
  },
})
