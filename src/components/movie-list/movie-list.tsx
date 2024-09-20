import ErrorComponent from '@components/error-component'
import LoadingMessage from '@components/loading-message'
import {Suspense} from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import styled from 'styled-components'
import type {ErrorResponse, Movie} from '../../consumer'
import MovieItem from './movie-item'

type MovieListProps = Readonly<{
  movies: Movie[] | ErrorResponse | undefined
  onDelete: (id: number) => void
}>

export default function MovieList({movies, onDelete}: MovieListProps) {
  return (
    <ErrorBoundary fallback={<ErrorComponent />}>
      <Suspense fallback={<LoadingMessage />}>
        <SMovieList data-cy="movie-list-comp">
          {Array.isArray(movies) &&
            movies.map(movie => (
              <MovieItem key={movie.id} {...movie} onDelete={onDelete} />
            ))}
        </SMovieList>
      </Suspense>
    </ErrorBoundary>
  )
}

const SMovieList = styled.ul`
  list-style: none;
  padding: 0;
  max-width: 600px;
  margin: 0 auto 20px;
`
