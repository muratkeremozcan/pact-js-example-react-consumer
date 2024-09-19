import {useEffect, useState} from 'react'
import './App.css'
import type {Movie, ErrorResponse} from './consumer'
import {fetchMovies} from './consumer' // Importing necessary types and functions

function App() {
  const [movies, setMovies] = useState<Movie[] | null>(null)
  const [error, setError] = useState<ErrorResponse | null>(null)

  useEffect(() => {
    fetchMovies()
      .then(data => {
        console.log(data)
        if ('error' in data) setError(data)
        else setMovies(data)
      })
      .catch(err => {
        console.error(`Error fetching movies: ${err} `)
      })
  })

  return (
    <div className="App">
      <h1>Movie List</h1>
      {error ? (
        <p style={{color: 'red'}}>{error.error}</p>
      ) : movies ? (
        <ul>
          {movies.map(movie => (
            <li key={movie.id}>
              {movie.name} ({movie.year})
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading movies</p>
      )}
    </div>
  )
}

export default App
