import ErrorComponent from '@components/error-component'
import LoadingMessage from '@components/loading-message'
import {useMovie} from '@hooks/use-movies'
import {SButton, SInput, STitle} from '@styles/styled-components'
import {useState} from 'react'
import type {ErrorResponse} from 'src/consumer'
import styled from 'styled-components'

export default function MovieDetails() {
  const [identifier, setIdentifier] = useState<number | string>('')
  const [input, setInput] = useState('')

  const handleGetMovie = () => {
    const parsedNumber = parseInt(input, 10)
    if (!isNaN(parsedNumber)) setIdentifier(parsedNumber)
    else setIdentifier(input)
  }

  const {data: movie, error, isLoading} = useMovie(identifier)

  return (
    <SMovieDetails data-cy="movie-details-comp">
      <STitle>Movie Details</STitle>

      <SInput
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Enter movie ID or title"
        data-cy="movie-details-input"
      />

      <SButton data-cy="get-movie-button" onClick={handleGetMovie}>
        Get Movie
      </SButton>

      {isLoading && <LoadingMessage />}

      {error && <ErrorComponent />}

      {movie && (
        <SMovieInfo>
          {'name' in movie ? (
            <>
              <h2>{movie.name}</h2>
              <p>ID: {movie.id}</p>
              <p>Year: {movie.year}</p>
            </>
          ) : (
            <p>{(movie as ErrorResponse).error}</p>
          )}
        </SMovieInfo>
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

const SMovieInfo = styled.div`
  h2 {
    margin-top: 20px;
    color: #333;
    font-size: 24px;
  }
  p {
    font-size: 18px;
    color: #555;
  }
`
