import {
  describe,
  expect,
  it,
  vi,
  screen,
  wrappedRender,
} from '@vitest-utils/utils'
import {generateMovie} from '@cypress/support/factories'
import MovieList from './movie-list'

describe('<MovieList />', () => {
  const onDelete = vi.fn()

  it('should show nothing with no movies', () => {
    wrappedRender(<MovieList movies={[]} onDelete={onDelete} />)

    expect(screen.queryByTestId('movie-list-comp')).not.toBeInTheDocument()
    expect(onDelete).not.toHaveBeenCalled()
  })

  it('should show error with error', () => {
    wrappedRender(<MovieList movies={{error: 'boom'}} onDelete={onDelete} />)

    expect(screen.queryByTestId('movie-list-comp')).not.toBeInTheDocument()
    expect(screen.getByTestId('error')).toBeInTheDocument()
    expect(onDelete).not.toHaveBeenCalled()
  })

  it('should verify the movie and delete', () => {
    const movie1 = {id: 1, ...generateMovie()}
    const movie2 = {id: 2, ...generateMovie()}

    wrappedRender(<MovieList movies={[movie1, movie2]} onDelete={onDelete} />)

    expect(screen.getByTestId('movie-list-comp')).toBeVisible()

    const movieItems = screen.getAllByTestId('movie-item-comp')
    expect(movieItems).toHaveLength(2)
    movieItems.forEach(movieItem => {
      expect(movieItem).toBeVisible()
    })
  })
})
