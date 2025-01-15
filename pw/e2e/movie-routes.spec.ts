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
  let loadGetMovies: Promise<Response>

  test.beforeEach(async ({page}) => {
    await page.route('**/movies', route =>
      route.fulfill({
        status: 200,
        body: JSON.stringify({data: movies}),
        headers: {'Content-Type': 'application/json'},
      }),
    )
    loadGetMovies = page.waitForResponse(
      response =>
        response.url().includes('/movies') && response.status() === 200,
    )
  })

  test('should redirect to /movies', async ({page}) => {
    await page.goto('/')

    await expect(page).toHaveURL('/movies')
    const getMovies = await loadGetMovies
    const {data} = await getMovies.json()
    expect(data).toEqual(movies)

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

  test('should direct nav to by query param', async ({page}) => {
    const movieName = encodeURIComponent(movie?.name as Movie['name'])

    await page.route('**/movies?*', route =>
      route.fulfill({
        status: 200,
        body: JSON.stringify(movie),
        headers: {'Content-Type': 'application/json'},
      }),
    )
    const loadGetMovies2 = page.waitForResponse(
      response =>
        response.url().includes('/movies?') && response.status() === 200,
    )

    await page.goto(`/movies?name=${movieName}`)

    const getMovie = await loadGetMovies2
    const resBody = await getMovie.json()
    expect(resBody).toEqual(movie)

    await expect(page).toHaveURL(`/movies?name=${movieName}`)
  })
})
