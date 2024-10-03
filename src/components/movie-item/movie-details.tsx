import LoadingMessage from '@components/loading-message'
import {SButton, STitle} from '@styles/styled-components'
import type {ErrorResponse} from 'src/consumer'
import styled from 'styled-components'
import MovieManager from './movie-manager'
import {useMovieDetails} from '@hooks/use-movie-detail'
import {useDeleteMovie} from '@hooks/use-movies'
import {useNavigate} from 'react-router-dom'

export default function MovieDetails() {
  const {movie, isLoading, hasIdentifier} = useMovieDetails()
  const deleteMovieMutation = useDeleteMovie()
  const navigate = useNavigate()

  const handleDeleteMovie = (id: number) =>
    deleteMovieMutation.mutate(id, {
      onSuccess: () => navigate('/movies'), // Redirect to /movies after delete success
    })

  if (!hasIdentifier) return <p>No movie selected</p>
  if (isLoading) return <LoadingMessage />

  return (
    <SMovieDetails data-cy="movie-details-comp">
      <STitle>Movie Details</STitle>

      {movie && 'name' in movie ? (
        <MovieManager movie={movie} onDelete={handleDeleteMovie} />
      ) : (
        <p>{(movie as ErrorResponse).error}</p>
      )}

      <SButton onClick={() => navigate(-1)} data-cy="back">
        Back
      </SButton>
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
