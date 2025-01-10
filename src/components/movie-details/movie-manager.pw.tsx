import {test, expect} from '@playwright/experimental-ct-react'
import type {MovieManagerProps} from './movie-manager'
import MovieManager from './movie-manager'
import sinon from 'sinon'

test.describe('<MovieManager />', () => {
  const id = 1
  const name = 'Inception'
  const year = 2010
  const rating = 8.5
  const director = 'Christopher Nolan'

  const sandbox = sinon.createSandbox()

  test.afterEach(() => {
    sandbox.restore()
  })

  test('should toggle between movie info and movie edit components', async ({
    mount,
  }) => {
    const onDelete = sandbox.stub()
    const props: MovieManagerProps = {
      movie: {
        id,
        name,
        year,
        rating,
        director,
      },
      onDelete,
    }

    const c = await mount(<MovieManager {...props} />)

    await c.getByTestId('delete-movie').click()
    expect(onDelete.calledOnceWith(id)).toBe(true)

    await expect(c.getByTestId('movie-info-comp')).toBeVisible()
    await expect(c.getByTestId('movie-edit-form-comp')).not.toBeVisible()

    await c.getByTestId('edit-movie').click()
    await expect(c.getByTestId('movie-info-comp')).not.toBeVisible()
    await expect(c.getByTestId('movie-edit-form-comp')).toBeVisible()
  })
})
