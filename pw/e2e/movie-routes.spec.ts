import {test, expect} from '../support/fixtures'
import {generateMovie} from '../../cypress/support/factories'
import type {Response} from '@playwright/test'
import type {Movie} from '../../src/consumer'

test.describe('App routes', () => {
  const movies = [
    {id: 1, ...generateMovie()},
    {id: 2, ...generateMovie()},
    {id: 3, ...generateMovie()},
  ]
  const movie = movies[0]
  let load: Promise<Response>

  test.beforeEach(({page}) => {
    page.route('**/movies', route =>
      route.fulfill({
        status: 200,
        body: JSON.stringify({data: movies}),
        headers: {'Content-Type': 'application/json'},
      }),
    )
    load = page.waitForResponse(
      response =>
        response.url().includes('/movies') && response.status() === 200,
    )
  })

  test('should redirect to /movies', async ({page}) => {
    await page.goto('/')

    await expect(page).toHaveURL('/movies')
    const getMovies = await load
    const {data} = await getMovies.json()
    expect(data).toEqual(movies)

    await expect(page.getByTestId('movie-list-comp')).toBeVisible()
    await expect(page.getByTestId('movie-form-comp')).toBeVisible()
    await expect(page.getByTestId('movie-item-comp')).toHaveCount(movies.length)
  })

  test('should direct nav to by query param', async ({page}) => {
    const movieName = encodeURIComponent(movie?.name as Movie['name'])

    page.route('**/movies?*', route =>
      route.fulfill({
        status: 200,
        body: JSON.stringify(movie),
      }),
    )
    const load2 = page.waitForResponse(
      response =>
        response.url().includes('/movies?') && response.status() === 200,
    )

    await page.goto(`/movies?name=${movieName}`)

    const getMovie = await load2
    const resBody = await getMovie.json()
    expect(resBody).toEqual(movie)

    await expect(page).toHaveURL(`/movies?name=${movieName}`)
  })
})
