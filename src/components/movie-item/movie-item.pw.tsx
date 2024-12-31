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
    const id = 3
    const c = await mount(
      <MovieItem
        id={id}
        name={'my movie'}
        year={2023}
        rating={8.5}
        director={'my director'}
        onDelete={onDelete}
      />,
    )

    const link = c.getByText('my movie')
    await expect(link).toBeVisible()
    await expect(link).toHaveAttribute('href', `/movies/${id}`)

    await c.getByRole('button', {name: /delete/i}).click()
    expect(onDelete.calledOnce).toBe(true)
    expect(onDelete.calledWith(id)).toBe(true)
  })
})
