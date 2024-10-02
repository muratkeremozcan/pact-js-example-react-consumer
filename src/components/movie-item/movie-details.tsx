import LoadingMessage from '@components/loading-message'
import {STitle} from '@styles/styled-components'
import type {ErrorResponse} from 'src/consumer'
import styled from 'styled-components'
import MovieInfo from './movie-info'
import {useMovieDetails} from './use-movie-detail'

export default function MovieDetails() {
  const {movie, isLoading, hasIdentifier} = useMovieDetails()

  if (!hasIdentifier) return <p>No movie selected</p>
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
