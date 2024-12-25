import {generateMovie} from '../../cypress/support/factories' // Adjust path if necessary
import type {Movie} from '../../src/consumer'
import {expect, test} from '../support/fixtures'
import {addMovie} from '../support/helpers/add-movie'
import {editMovie} from '../support/helpers/edit-movie'

test.describe('movie crud e2e stubbed', () => {
  // Generate initial movie data
  const {name, year, rating, director} = generateMovie()
  const id = 1
  const movie: Movie = {id, name, year, rating, director}

  // Generate edited movie data
  const {
    name: editedName,
    year: editedYear,
    rating: editedRating,
    director: editedDirector,
  } = generateMovie()

  test('should add a movie', async ({page}) => {
    page.route('**/movies', route =>
      route.fulfill({
        status: 200,
        body: JSON.stringify({data: []}),
        headers: {'Content-Type': 'application/json'},
      }),
    )
    const loadGetMovies = page.waitForResponse(
      response =>
        response.url().includes('/movies') &&
        response.request().method() === 'GET' &&
        response.status() === 200,
    )

    await page.goto('/')
    await loadGetMovies

    await addMovie(page, name, year, rating, director)

    page.route('**/movies', route => {
      if (route.request().method() === 'POST') {
        return route.fulfill({
          status: 200,
          body: JSON.stringify(movie),
          headers: {'Content-Type': 'application/json'},
        })
      } else if (route.request().method() === 'GET') {
        return route.fulfill({
          status: 200,
          body: JSON.stringify({data: [movie]}),
          headers: {'Content-Type': 'application/json'},
        })
      } else {
        return route.continue()
      }
    })
    const loadAddMovie = page.waitForResponse(
      response =>
        response.url().includes('/movies') &&
        response.request().method() === 'POST' &&
        response.status() === 200,
    )
    const loadGetMovies2 = page.waitForResponse(
      response =>
        response.url().includes('/movies') &&
        response.request().method() === 'GET' &&
        response.status() === 200,
    )

    await page.getByTestId('add-movie-button').click()
    await loadAddMovie
    await loadGetMovies2
  })

  test('should edit a movie', async ({page}) => {
    page.route('**/movies', route =>
      route.fulfill({
        status: 200,
        body: JSON.stringify({data: [movie]}),
        headers: {'Content-Type': 'application/json'},
      }),
    )
    const loadGetMovies = page.waitForResponse(
      response =>
        response.url().includes('/movies') &&
        response.request().method() === 'GET' &&
        response.status() === 200,
    )

    page.route('**/movies/*', route =>
      route.fulfill({
        status: 200,
        body: JSON.stringify({data: movie}),
        headers: {'Content-Type': 'application/json'},
      }),
    )
    const loadGetMovieById = page.waitForResponse(
      response =>
        response.url().includes(`/movies/${id}`) &&
        response.request().method() === 'GET' &&
        response.status() === 200,
    )

    await page.goto('/')
    await loadGetMovies

    await page.getByTestId(`link-${id}`).click()
    const getMovieByIdResponse = await loadGetMovieById

    await expect(page).toHaveURL(`/movies/${id}`)
    const {data} = await getMovieByIdResponse.json()
    expect(data).toEqual(movie)

    page.route(`**/movies/${id}`, route => {
      if (route.request().method() === 'PUT') {
        const updatedMovie: Movie = {
          id: movie.id,
          name: editedName,
          year: editedYear,
          rating: editedRating,
          director: editedDirector,
        }
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(updatedMovie),
        })
      } else {
        route.continue()
      }
    })

    const updateMovieByIdLoad = page.waitForResponse(
      response =>
        response.url().includes(`/movies/${id}`) &&
        response.request().method() === 'PUT' &&
        response.status() === 200,
    )

    await editMovie(page, editedName, editedYear, editedRating, editedDirector)

    const updateMovieByIdRes = await updateMovieByIdLoad
    const updateMovieData = await updateMovieByIdRes.json()
    expect(updateMovieData.name).toBe(editedName)
  })

  test('should delete a movie', async ({page}) => {
    page.route('**/movies', route =>
      route.fulfill({
        status: 200,
        body: JSON.stringify({data: [movie]}),
        headers: {'Content-Type': 'application/json'},
      }),
    )
    const loadGetMovies = page.waitForResponse(
      response =>
        response.url().includes('/movies') &&
        response.request().method() === 'GET' &&
        response.status() === 200,
    )

    await page.goto('/')
    await loadGetMovies

    page.route(`**/movies/${id}`, route => {
      if (route.request().method() === 'DELETE') {
        route.fulfill({
          status: 200,
        })
      } else {
        route.continue()
      }
    })
    const loadDeleteMovie = page.waitForResponse(
      response =>
        response.url().includes(`/movies/${id}`) &&
        response.request().method() === 'DELETE' &&
        response.status() === 200,
    )

    page.route('**/movies', route =>
      route.fulfill({
        status: 200,
        body: JSON.stringify({data: []}),
        headers: {'Content-Type': 'application/json'},
      }),
    )
    const loadGetMoviesAfterDelete = page.waitForResponse(
      response =>
        response.url().includes('/movies') &&
        response.request().method() === 'GET' &&
        response.status() === 200,
    )

    await page.getByTestId(`delete-movie-${name}`).click()
    await loadDeleteMovie
    await loadGetMoviesAfterDelete

    await expect(page.getByTestId(`delete-movie-${name}`)).not.toBeVisible()
  })
})
