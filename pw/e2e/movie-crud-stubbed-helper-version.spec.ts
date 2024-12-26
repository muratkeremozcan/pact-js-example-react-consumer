import {editMovie} from 'pw/support/ui-helpers/edit-movie'
import {generateMovie} from '../../cypress/support/factories'
import type {Movie} from '../../src/consumer'
import {expect, test} from '../support/fixtures'
import {addMovie} from '../support/ui-helpers/add-movie'
import {interceptNetworkCall} from '../support/utils/network'

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
    // Initial empty movies list
    const loadGetMovies = interceptNetworkCall({
      method: 'GET',
      url: '/movies',
      page,
      fulfillResponse: {
        status: 200,
        body: {data: []},
      },
    })

    await page.goto('/')
    await loadGetMovies

    await addMovie(page, name, year, rating, director)

    // Single intercept for both POST and GET
    const loadPostOrGetMovies = interceptNetworkCall({
      page,
      url: '/movies',
      handler: async (route, request) => {
        if (request.method() === 'POST') {
          await route.fulfill({
            status: 200,
            body: JSON.stringify(movie),
          })
        } else if (request.method() === 'GET') {
          await route.fulfill({
            status: 200,
            body: JSON.stringify({data: [movie]}),
          })
        } else {
          await route.continue()
        }
      },
    })

    await page.getByTestId('add-movie-button').click()
    await loadPostOrGetMovies
  })

  test('should edit a movie', async ({page}) => {
    const loadGetMovies = interceptNetworkCall({
      method: 'GET',
      url: '**/movies',
      page,
      fulfillResponse: {
        status: 200,
        body: {data: [movie]},
      },
    })

    const loadGetMovieById = interceptNetworkCall({
      page,
      method: 'GET',
      url: '**/movies/*',
      fulfillResponse: {
        status: 200,
        body: {data: movie},
      },
    })

    await page.goto('/')
    await loadGetMovies

    await page.getByTestId(`link-${id}`).click()
    await loadGetMovieById

    await expect(page).toHaveURL(`/movies/${id}`)

    const loadUpdateMovieById = interceptNetworkCall({
      page,
      method: 'PUT',
      url: '**/movies/*',
      fulfillResponse: {
        status: 200,
        body: {
          data: {
            id: movie.id,
            name: editedName,
            year: editedYear,
            rating: editedRating,
            director: editedDirector,
          },
        },
      },
    })

    await editMovie(page, editedName, editedYear, editedRating, editedDirector)
    const {data} = await loadUpdateMovieById
    expect((data as {data: Movie}).data.name).toBe(editedName)
  })

  test('should delete a movie', async ({page}) => {
    const loadGetMovies = interceptNetworkCall({
      method: 'GET',
      url: '**/movies',
      page,
      fulfillResponse: {
        status: 200,
        body: {data: [movie]},
      },
    })

    await page.goto('/')
    await loadGetMovies

    const loadDeleteMovie = interceptNetworkCall({
      page,
      method: 'DELETE',
      url: '**/movies/*',
      fulfillResponse: {
        status: 200,
      },
    })

    const loadGetMoviesAfterDelete = interceptNetworkCall({
      method: 'GET',
      url: '**/movies',
      page,
      fulfillResponse: {
        status: 200,
        body: {data: []},
      },
    })

    await page.getByTestId(`delete-movie-${name}`).click()
    await loadDeleteMovie
    await loadGetMoviesAfterDelete

    await expect(page.getByTestId(`delete-movie-${name}`)).not.toBeVisible()
  })
})
