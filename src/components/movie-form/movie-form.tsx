import styled from 'styled-components'
import MovieInput from './movie-input'
import ValidationErrorDisplay from './validation-error-display'
import {useMovieForm} from '@hooks/use-movie-form'
import {SButton} from '@styles/styled-components'

export default function MovieForm() {
  const {
    movieName,
    setMovieName,
    movieYear,
    setMovieYear,
    handleAddMovie,
    movieLoading,
    validationError,
  } = useMovieForm()

  return (
    <div data-cy="movie-form-comp">
      <SSubtitle>Add a New Movie</SSubtitle>

      {/* Zod key feature 4: use the validation state at the component  */}
      <ValidationErrorDisplay validationError={validationError} />

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

const SSubtitle = styled.h2`
  color: #333;
  font-size: 2rem;
  margin-bottom: 10px;
`
