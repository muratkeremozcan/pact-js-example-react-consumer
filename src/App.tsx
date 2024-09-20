import MovieForm from '@components/movie-form'
import MovieList from '@components/movie-list'
import {useDeleteMovie, useMovies} from '@hooks/use-movies'
import {SAppContainer, STitle} from '@styles/styled-components'
import LoadingMessage from '@components/loading-message'
import {Suspense} from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import ErrorComponent from '@components/error-component'

function App() {
  const {data: movies} = useMovies()

  const deleteMovieMutation = useDeleteMovie()
  const handleDeleteMovie = (id: number) => deleteMovieMutation.mutate(id)

  return (
    <ErrorBoundary fallback={<ErrorComponent />}>
      <Suspense fallback={<LoadingMessage />}>
        <SAppContainer>
          <STitle>Movie List</STitle>

          <MovieList movies={movies} onDelete={handleDeleteMovie} />

          <MovieForm />
        </SAppContainer>
      </Suspense>
    </ErrorBoundary>
  )
}

export default App
