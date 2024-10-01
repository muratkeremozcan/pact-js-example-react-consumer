import LoadingMessage from '@components/loading-message'
import {useMovie} from '@hooks/use-movies'
import {STitle} from '@styles/styled-components'
import {useParams, useSearchParams} from 'react-router-dom'
import type {ErrorResponse} from 'src/consumer'
import styled from 'styled-components'
import MovieInfo from './movie-info'

export default function MovieDetails() {
  // Get the id from the route params or query parameters
  const {id} = useParams<{id: string}>()
  const [searchParams] = useSearchParams()
  const movieName = searchParams.get('name')

  const identifier =
    movieName ?? (id && !isNaN(Number(id)) ? parseInt(id, 10) : null)
  if (!identifier) return <p>No movie selected</p>

  const {data: movie, isLoading} = useMovie(identifier)

  if (isLoading) return <LoadingMessage />

  return (
    <SMovieDetails data-cy="movie-details-comp">
      <STitle>Movie Details</STitle>

      {movie && 'name' in movie ? (
        <MovieInfo movie={movie} />
      ) : (
        <p>{(movie as ErrorResponse).error}</p>
      )}
    </SMovieDetails>
  )
}

const SMovieDetails = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`
