import './App.css'
import {useMovies, useAddMovie, useDeleteMovie} from './hooks/useMovies'
import {useState} from 'react'

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
    <div className="App">
      <h1>Movie List</h1>

      {moviesLoading ? (
        <p>Loading movies...</p>
      ) : error ? (
        <p style={{color: 'red'}}>{error.message}</p>
      ) : (
        <ul>
          {Array.isArray(movies) &&
            movies.map(movie => (
              <li key={movie.id}>
                {movie.name} ({movie.year})
                <button onClick={() => handleDeleteMovie(movie.id)}>
                  Delete
                </button>
              </li>
            ))}
        </ul>
      )}

      <h2>Add a New Movie</h2>
      <input
        type="text"
        placeholder="Movie name"
        value={movieName}
        onChange={e => setMovieName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Movie year"
        value={movieYear}
        onChange={e => setMovieYear(Number(e.target.value))}
      />
      <button onClick={handleAddMovie} disabled={movieLoading}>
        {movieLoading ? 'Adding...' : 'Add Movie'}
      </button>
    </div>
  )
}

export default App
