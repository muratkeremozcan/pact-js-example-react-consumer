import {test, expect} from '@playwright/experimental-ct-react'
import MovieEditForm from './movie-edit-form'
import {generateMovie} from '@cypress/support/factories'
import {interceptNetworkCall} from '@pw/support/utils/network'
import sinon from 'sinon'

test.describe('<MovieEditForm />', () => {
  const id = 7
  const movie = {id, ...generateMovie()}

  const sandbox = sinon.createSandbox()

  test.afterEach(() => {
    sandbox.restore()
  })

  test('should cancel and submit a movie update', async ({mount, page}) => {
    const onCancel = sandbox.stub()
    const c = await mount(<MovieEditForm movie={movie} onCancel={onCancel} />)

    await c.getByTestId('cancel').click()
    expect(onCancel.calledOnce).toBe(true)

    const loadUpdateMovie = interceptNetworkCall({
      page,
      method: 'PUT',
      url: `/movies/${id}`,
      fulfillResponse: {
        status: 200,
      },
    })

    await c.getByTestId('update-movie').click()

    const {requestJson} = await loadUpdateMovie
    expect(requestJson).toMatchObject({
      name: movie.name,
      year: movie.year,
      rating: movie.rating,
      director: movie.director,
    })
  })
})
