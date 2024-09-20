import styled from 'styled-components'
import {SButton} from '../../styles/styled-components'
import {useMovieForm} from './use-movie-form'
import MovieInput from './movie-input'

export default function MovieForm() {
  const {
    movieName,
    setMovieName,
    movieYear,
    setMovieYear,
    handleAddMovie,
    movieLoading,
  } = useMovieForm()

  return (
    <div data-cy="movie-form-comp">
      <SSubtitle>Add a New Movie</SSubtitle>
      <MovieInput
        type="text"
        value={movieName}
        placeHolder="Movie name"
        onChange={e => setMovieName(e.target.value)}
      />
      <MovieInput
        type="number"
        value={movieYear}
        placeHolder="Movie year"
        onChange={e => setMovieYear(Number(e.target.value))}
      />
      <SButton
        data-cy="add-movie-button"
        onClick={handleAddMovie}
        disabled={movieLoading}
      >
        {movieLoading ? 'Adding...' : 'Add Movie'}
      </SButton>
    </div>
  )
}

export const SSubtitle = styled.h2`
  color: #333;
  font-size: 2rem;
  margin-bottom: 10px;
`
