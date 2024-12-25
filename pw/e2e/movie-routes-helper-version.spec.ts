import {test, expect} from '../support/fixtures'
import {generateMovie} from '../../cypress/support/factories'
import type {InterceptNetworkCall} from '../support/utils/network'
import {interceptNetworkCall} from '../support/utils/network'
import type {Movie} from 'src/consumer'

test.describe('App routes', () => {
  const movies = [
    {id: 1, ...generateMovie()},
    {id: 2, ...generateMovie()},
    {id: 3, ...generateMovie()},
  ]
  const movie = movies[0]
  let load: InterceptNetworkCall

  test.beforeEach(({page}) => {
    load = interceptNetworkCall({
      method: 'GET',
      url: '/movies',
      page,
      fulfillResponse: {
        status: 200,
        body: {data: movies},
      },
    })
  })

  test('should redirect to /movies', async ({page}) => {
    await page.goto('/')

    await expect(page).toHaveURL('/movies')
    const {
      data: {data: moviesResponse},
    } = (await load) as {data: {data: typeof movies}}
    expect(moviesResponse).toEqual(movies)

    await expect(page.getByTestId('movie-list-comp')).toBeVisible()
    await expect(page.getByTestId('movie-form-comp')).toBeVisible()
    await expect(page.getByTestId('movie-item-comp')).toHaveCount(movies.length)
  })

  test('should direct nav to by query param', async ({page}) => {
    const movieName = encodeURIComponent(movie?.name as Movie['name'])

    const load2 = interceptNetworkCall({
      method: 'GET',
      url: '/movies?',
      page,
      fulfillResponse: {
        status: 200,
        body: movie,
      },
    })

    await page.goto(`/movies?name=${movieName}`)

    const {data} = await load2
    expect(data).toEqual(movie)

    await expect(page).toHaveURL(`/movies?name=${movieName}`)
  })
})
