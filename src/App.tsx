import MovieForm from '@components/movie-form'
import MovieList from '@components/movie-list'
import {useDeleteMovie, useMovies} from '@hooks/use-movies'
import {SAppContainer, STitle} from '@styles/styled-components'

function App() {
  const {data: movies} = useMovies()
  const deleteMovieMutation = useDeleteMovie()

  const handleDeleteMovie = (id: number) => {
    deleteMovieMutation.mutate(id)
  }

  return (
    <SAppContainer>
      <STitle>Movie List</STitle>

      <MovieList movies={movies} onDelete={handleDeleteMovie} />

      <MovieForm />
    </SAppContainer>
  )
}

export default App
