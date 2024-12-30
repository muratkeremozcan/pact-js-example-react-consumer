import {test, expect} from '../support/fixtures'
import {generateMovie} from '../../cypress/support/factories'
import type {InterceptNetworkCall} from '../support/utils/network'
import type {Movie} from 'src/consumer'

test.describe('App routes', () => {
  const movies = [
    {id: 1, ...generateMovie()},
    {id: 2, ...generateMovie()},
    {id: 3, ...generateMovie()},
  ]
  const movie = movies[0]
  let loadGetMovies: InterceptNetworkCall

  test.beforeEach(({interceptNetworkCall}) => {
    loadGetMovies = interceptNetworkCall({
      method: 'GET',
      url: '/movies',
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
    } = (await loadGetMovies) as {data: {data: typeof movies}}
    expect(moviesResponse).toEqual(movies)

    await expect(page.getByTestId('movie-list-comp')).toBeVisible()
    await expect(page.getByTestId('movie-form-comp')).toBeVisible()
    await expect(page.getByTestId('movie-item-comp')).toHaveCount(movies.length)
    // with PW you have to use for await of, since you have to await the expect
    const movieItemComps = page.getByTestId('movie-item-comp').all()
    const items = await movieItemComps
    for (const item of items) {
      await expect(item).toBeVisible()
    }
  })

  test('should direct nav to by query param', async ({
    page,
    interceptNetworkCall,
  }) => {
    const movieName = encodeURIComponent(movie?.name as Movie['name'])

    const loadGetMovies2 = interceptNetworkCall({
      method: 'GET',
      url: '/movies?',
      fulfillResponse: {
        status: 200,
        body: movie,
      },
    })

    await page.goto(`/movies?name=${movieName}`)

    const {data: resBody} = await loadGetMovies2
    expect(resBody).toEqual(movie)

    await expect(page).toHaveURL(`/movies?name=${movieName}`)
  })
})
