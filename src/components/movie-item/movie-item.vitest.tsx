import {
  wrappedRender,
  screen,
  describe,
  it,
  expect,
  vi,
  userEvent,
} from '@vitest-utils/utils'

import MovieItem from './movie-item'

describe('<MovieItem />', () => {
  const onDelete = vi.fn()
  const user = userEvent.setup()

  it('should verify the movie and delete', async () => {
    wrappedRender(
      <MovieItem
        id={3}
        name={'my movie'}
        year={2023}
        rating={8.5}
        director={'my director'}
        onDelete={onDelete}
      />,
    )

    const link = screen.getByText('my movie (2023) 8.5 my director')
    expect(link).toBeVisible()
    expect(link).toHaveAttribute('href', '/movies/3')

    await user.click(screen.getByRole('button', {name: /delete/i}))

    expect(onDelete).toHaveBeenCalledTimes(1)
    expect(onDelete).toHaveBeenCalledWith(3)
  })
})
