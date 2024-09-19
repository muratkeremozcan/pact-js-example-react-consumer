import type {AxiosResponse, AxiosError} from 'axios'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

// Movie type from the provider, in the real world this would come from a published package
export type Movie = {
  id: number
  name: string
  year: number
}

// Error response type
export type ErrorResponse = {
  error: string
}

// Success response type
export type SuccessResponse = {
  message: string
}

// baseURL in axiosInstance: Axios uses a fixed base URL for all requests,
// and Nock must intercept that exact URL for the tests to work
const axiosInstance = axios.create({
  baseURL: API_URL, // this is really the API url where the requests are going to
})

// Helper function to extract data from Axios response
const yieldData = <T>(res: AxiosResponse<T>): T => res.data

// Helper function to handle errors
const handleError = (err: AxiosError): ErrorResponse => {
  if (err.response?.data) return err.response.data as ErrorResponse
  return {error: 'Unexpected error occurred'}
}

// Fetch all movies
const fetchMovies = (): Promise<Movie[] | ErrorResponse> =>
  axiosInstance.get('/movies').then(yieldData).catch(handleError)

// Fetch a single movie by ID
const fetchSingleMovie = (id: number): Promise<Movie | ErrorResponse> =>
  axiosInstance.get(`/movie/${id}`).then(yieldData).catch(handleError)

// Add a new movie (don't specify id)
const addNewMovie = async (
  movieName: string,
  movieYear: number,
): Promise<Movie | ErrorResponse> => {
  const data: Omit<Movie, 'id'> = {
    name: movieName,
    year: movieYear,
  }

  const response = await axiosInstance
    .post('/movies', data)
    .then(yieldData)
    .catch(handleError)

  return response
}

// Delete a movie by ID
const deleteMovie = (id: number): Promise<SuccessResponse | ErrorResponse> =>
  axiosInstance.delete(`/movie/${id}`).then(yieldData).catch(handleError)

export {fetchMovies, fetchSingleMovie, addNewMovie, deleteMovie}
