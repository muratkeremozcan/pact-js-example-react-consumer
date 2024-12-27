import {test, expect} from '@playwright/experimental-ct-react'
import MovieItem from './movie-item'
import sinon from 'sinon'

test.describe('<MovieItem>', () => {
  const sandbox = sinon.createSandbox()
  const onDelete = sandbox.stub()
  test.afterEach(() => {
    sandbox.restore()
  })

  test('should verify the movie and delete', async ({mount}) => {
    const component = await mount(
      <MovieItem
        id={3}
        name={'my movie'}
        year={2023}
        rating={8.5}
        director={'my director'}
        onDelete={onDelete}
      />,
    )

    const link = component.getByText('my movie')
    await expect(link).toBeVisible()
    await expect(link).toHaveAttribute('href', '/movies/3')

    await component.getByRole('button', {name: /delete/i}).click()
    expect(onDelete.calledOnce).toBe(true)
    expect(onDelete.calledWith(3)).toBe(true)
  })
})
