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

  test.beforeEach(async ({page, interceptNetworkCall}) => {
    const loadGetMovies = interceptNetworkCall({
      method: 'GET',
      url: '/movies',
    })

    await page.goto('/')
    const {status: responseStatus} = await loadGetMovies
    expect(responseStatus).toBeGreaterThanOrEqual(200)
    expect(responseStatus).toBeLessThan(400)
  })

  test('should add and delete a movie from movie list', async ({
    page,
    interceptNetworkCall,
  }) => {
    const {name, year, rating, director} = generateMovie()

    await addMovie(page, name, year, rating, director)

    const loadAddMovie = interceptNetworkCall({
      method: 'POST',
      url: '/movies',
    })

    await page.getByTestId('add-movie-button').click()

    const {responseJson: addMovieResponseBody} = await loadAddMovie
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

    const loadDeleteMovie = interceptNetworkCall({
      method: 'DELETE',
      url: '/movies/*',
    })

    await page.getByTestId(`delete-movie-${name}`).click()

    const {responseJson: deleteMovieResponseBody} = await loadDeleteMovie
    expect(deleteMovieResponseBody).toEqual({
      status: 200,
      message: expect.any(String),
    })

    await expect(page.getByTestId(`delete-movie-${name}`)).not.toBeVisible()
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
