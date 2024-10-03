import {useDeleteMovie, useMovies} from '@hooks/use-movies'
import {SAppContainer} from '@styles/styled-components'
import LoadingMessage from '@components/loading-message'
import {Suspense} from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import ErrorComponent from '@components/error-component'
import AppRoutes from './App-routes'

function App() {
  const {data: movies} = useMovies()

  const deleteMovieMutation = useDeleteMovie()
  const handleDeleteMovie = (id: number) => deleteMovieMutation.mutate(id)

  return (
    <ErrorBoundary fallback={<ErrorComponent />}>
      <Suspense fallback={<LoadingMessage />}>
        <SAppContainer>
          <AppRoutes movies={movies} onDelete={handleDeleteMovie} />
        </SAppContainer>
      </Suspense>
    </ErrorBoundary>
  )
}

export default App
