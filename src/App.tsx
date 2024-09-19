import {useMovies, useAddMovie, useDeleteMovie} from './hooks/useMovies'
import {useState} from 'react'
import {
  AppContainer,
  Title,
  MovieList,
  MovieItem,
  Button,
  Input,
  Subtitle,
} from './styles/styled-components'

function App() {
  const {data: movies, error, isLoading: moviesLoading} = useMovies()
  const {status, mutate} = useAddMovie()
  const movieLoading = status === 'pending'
  const deleteMovieMutation = useDeleteMovie()

  const [movieName, setMovieName] = useState('')
  const [movieYear, setMovieYear] = useState(2023)

  const handleAddMovie = () => {
    mutate({name: movieName, year: movieYear})
    setMovieName('')
    setMovieYear(2023)
  }

  const handleDeleteMovie = (id: number) => {
    deleteMovieMutation.mutate(id)
  }

  return (
    <AppContainer>
      <Title>Movie List</Title>

      {moviesLoading ? (
        <p>Loading movies...</p>
      ) : error ? (
        <p style={{color: 'red'}}>{error.message}</p>
      ) : (
        <MovieList>
          {Array.isArray(movies) &&
            movies.map(movie => (
              <MovieItem key={movie.id}>
                {movie.name} ({movie.year})
                <Button onClick={() => handleDeleteMovie(movie.id)}>
                  Delete
                </Button>
              </MovieItem>
            ))}
        </MovieList>
      )}

      <Subtitle>Add a New Movie</Subtitle>
      <Input
        type="text"
        placeholder="Movie name"
        value={movieName}
        onChange={e => setMovieName(e.target.value)}
      />
      <Input
        type="number"
        placeholder="Movie year"
        value={movieYear}
        onChange={e => setMovieYear(Number(e.target.value))}
      />
      <Button onClick={handleAddMovie} disabled={movieLoading}>
        {movieLoading ? 'Adding...' : 'Add Movie'}
      </Button>
    </AppContainer>
  )
}

export default App
