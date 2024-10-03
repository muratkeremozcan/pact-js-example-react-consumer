import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useSearchParams,
} from 'react-router-dom'
import type {ErrorResponse, Movie} from './consumer'
import MovieList from '@components/movie-list'
import MovieDetails from '@components/movie-item/movie-details'

type AppRoutesProps = Readonly<{
  movies: Movie[] | ErrorResponse | undefined
  onDelete: (id: number) => void
}>

export default function AppRoutes({movies, onDelete}: AppRoutesProps) {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/movies"
          element={<MovieListWrapper movies={movies} onDelete={onDelete} />}
        />
        <Route path="/" element={<Navigate to="/movies" replace />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
      </Routes>
    </BrowserRouter>
  )
}

/**
 * Conditionally renders either the list of movies or the details of a specific movie.
 *
 * If the "name" query parameter is present in the URL, it renders the MovieDetails component.
 * Otherwise, it renders the MovieList component, displaying a list of all available movies.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {Movie[] | ErrorResponse | undefined} props.movies - The list of movies or an error response.
 * @param {function} props.onDelete - A callback function for deleting a movie by its ID.
 * @returns {JSX.Element} - The rendered MovieList or MovieDetails component.
 *
 * @example
 * // Example usage:
 * <MovieListWrapper movies={movieArray} onDelete={handleDeleteMovie} />
 */
function MovieListWrapper({movies, onDelete}: AppRoutesProps) {
  const [searchParams] = useSearchParams()
  const movieName = searchParams.get('name')

  return movieName ? (
    <MovieDetails />
  ) : (
    <MovieList movies={movies} onDelete={onDelete} />
  )
}
