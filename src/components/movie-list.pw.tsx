import {test, expect} from '@playwright/experimental-ct-react'
import MovieList from './movie-list'
import {generateMovie} from '@support/factories'
import sinon from 'sinon'

test.describe('<MovieList>', () => {
  const sandbox = sinon.createSandbox()
  const onDelete = sandbox.stub()

  test.afterEach(() => {
    sandbox.restore()
  })

  test('should show nothing with no movies', async ({mount}) => {
    const c = await mount(<MovieList movies={[]} onDelete={onDelete} />)

    await expect(c.getByTestId('movie-list-comp')).not.toBeVisible()
  })

  test('should show error with error', async ({mount}) => {
    const c = await mount(
      <MovieList movies={{error: 'boom'}} onDelete={onDelete} />,
    )

    await expect(c.getByTestId('movie-list-comp')).not.toBeVisible()
    await expect(c.getByTestId('error')).toBeVisible()
  })

  test('should verify the movie and delete', async ({mount}) => {
    const movie1Id = 7
    const movie2Id = 42
    const movie1 = {id: movie1Id, ...generateMovie()}
    const movie2 = {id: movie2Id, ...generateMovie()}

    const c = await mount(
      <MovieList movies={[movie1, movie2]} onDelete={onDelete} />,
    )

    await expect(c.getByTestId('movie-list-comp')).toBeVisible()

    const movieItems = c.getByTestId('movie-item-comp').all()
    const items = await movieItems
    expect(items).toHaveLength(2)
    // with PW you have to use for await of, since you have to await the expect
    for (const item of items) {
      await expect(item).toBeVisible()
    }

    await c.getByTestId(`delete-movie-${movie1.name}`).click()
    await c.getByTestId(`delete-movie-${movie2.name}`).click()
    expect(onDelete.calledTwice).toBe(true)
    expect(onDelete.callCount).toBe(2)
    expect(onDelete.calledWith(movie1Id)).toBe(true)
    expect(onDelete.calledWith(movie2Id)).toBe(true)
  })
})
