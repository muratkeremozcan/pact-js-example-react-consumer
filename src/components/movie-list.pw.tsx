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
    const movie1 = {id: 1, ...generateMovie()}
    const movie2 = {id: 2, ...generateMovie()}

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

    await c.getByText('Delete').first().click()
    expect(onDelete.calledOnce).toBe(true)
    expect(onDelete.calledWith(1)).toBe(true)
  })
})
