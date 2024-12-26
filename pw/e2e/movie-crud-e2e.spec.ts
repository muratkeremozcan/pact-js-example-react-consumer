import {generateMovie} from '@support/factories'
import {expect, test} from '../support/fixtures'
import {addMovie} from '../support/ui-helpers/add-movie'
import {editMovie} from '../support/ui-helpers/edit-movie'
import {runCommand} from '../support/utils/run-command'
const isCI = require('is-ci')

test.describe('movie crud e2e', () => {
  test.beforeAll(() => {
    // skip in CI, for sure the server is not running
    // when local, skip if the server is not running
    const responseCode = runCommand(
      `curl -s -o /dev/null -w "%{http_code}" ${process.env.VITE_API_URL}`,
    )
    if (isCI || responseCode !== '200') {
      test.skip()
    }
  })

  test.beforeEach(
    'should add and delete a movie from movie list',
    async ({page}) => {
      const loadGetMovies = page.waitForResponse(
        response =>
          response.url().includes('/movies') &&
          response.request().method() === 'GET',
      )
      await page.goto('/')
      const response = await loadGetMovies
      const responseStatus = await response.status()
      expect(responseStatus).toBeGreaterThanOrEqual(200)
      expect(responseStatus).toBeLessThan(400)
    },
  )

  test('should add and delete a movie from movie list', async ({page}) => {
    const {name, year, rating, director} = generateMovie()

    await addMovie(page, name, year, rating, director)

    const loadAddMovie = page.waitForResponse(
      response =>
        response.url().includes('/movies') &&
        response.request().method() === 'POST',
    )

    await page.getByTestId('add-movie-button').click()

    const addMovieResponse = await loadAddMovie
    const addMovieResponseBody = await addMovieResponse.json()
    expect(addMovieResponseBody).toEqual({
      status: 200,
      data: {
        id: expect.any(Number),
        name,
        year,
        rating,
        director,
      },
    })

    const loadDeleteMovie = page.waitForResponse(
      response =>
        response.url().includes('/movies/') &&
        response.request().method() === 'DELETE',
    )

    await page.getByTestId(`delete-movie-${name}`).click()

    const deleteMovieResponse = await loadDeleteMovie
    const deleteMovieResponseBody = await deleteMovieResponse.json()
    expect(deleteMovieResponseBody).toEqual({
      status: 200,
      message: expect.any(String),
    })

    expect(await page.getByTestId(`delete-movie-${name}`)).not.toBeVisible()
  })

  test('should update and delete a movie at movie manager', async ({
    page,
    addMovie,
    apiRequest,
  }) => {
    const movie = generateMovie()
    const {
      name: editedName,
      year: editedYear,
      rating: editedRating,
      director: editedDirector,
    } = generateMovie()

    const {
      body: {token},
    } = await apiRequest<{token: string}>({
      method: 'GET',
      url: '/auth/fake-token',
      baseUrl: process.env.VITE_API_URL,
    })

    const {body: createResponse} = await addMovie(
      token,
      movie,
      process.env.VITE_API_URL,
    )

    const id = createResponse.data.id

    await page.goto(`/movies/${id}`)

    await editMovie(page, editedName, editedYear, editedRating, editedDirector)

    await page.getByTestId('back').click()
    await expect(page).toHaveURL('/movies')
    await page.getByText(editedName).waitFor()

    await page.goto(`/movies/${id}`)
    await page.getByTestId('delete-movie').click()

    await expect(page).toHaveURL('/movies')
    await page.waitForSelector(`text=${editedName}`, {state: 'detached'})
  })
})
