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
    const component = await mount(<MovieList movies={[]} onDelete={onDelete} />)

    await expect(component.getByTestId('movie-list-comp')).not.toBeVisible()
    expect(onDelete.called).toBe(false)
  })

  test('should show error with error', async ({mount}) => {
    const component = await mount(
      <MovieList movies={{error: 'boom'}} onDelete={onDelete} />,
    )

    await expect(component.getByTestId('movie-list-comp')).not.toBeVisible()
    await expect(component.getByTestId('error')).toBeVisible()
    expect(onDelete.called).toBe(false)
  })

  test('should verify the movie and delete', async ({mount}) => {
    const movie1 = {id: 1, ...generateMovie()}
    const movie2 = {id: 2, ...generateMovie()}

    const component = await mount(
      <MovieList movies={[movie1, movie2]} onDelete={onDelete} />,
    )

    await expect(component.getByTestId('movie-list-comp')).toBeVisible()
    await expect(component.getByTestId('movie-item-comp')).toHaveCount(2)

    await component.getByText('Delete').first().click()
    expect(onDelete.calledOnce).toBe(true)
    expect(onDelete.calledWith(1)).toBe(true)
  })
})
