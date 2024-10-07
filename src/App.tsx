import {useDeleteMovie, useMovies} from '@hooks/use-movies'
import {SAppContainer} from '@styles/styled-components'
import LoadingMessage from '@components/loading-message'
import {Suspense} from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import ErrorComponent from '@components/error-component'
import AppRoutes from './App-routes'
import type {Movie} from './consumer'

function App() {
  const {data} = useMovies()
  const moviesData = (data as unknown as {data: Movie[]}).data

  const deleteMovieMutation = useDeleteMovie()
  const handleDeleteMovie = (id: number) => deleteMovieMutation.mutate(id)

  return (
    <ErrorBoundary fallback={<ErrorComponent />}>
      <Suspense fallback={<LoadingMessage />}>
        <SAppContainer>
          <AppRoutes movies={moviesData} onDelete={handleDeleteMovie} />
        </SAppContainer>
      </Suspense>
    </ErrorBoundary>
  )
}

export default App
