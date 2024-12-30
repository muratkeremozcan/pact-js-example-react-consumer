import {generateMovie} from '../../cypress/support/factories' // Adjust path if necessary
import type {Movie} from '../../src/consumer'
import {expect, test} from '../support/fixtures'
import {addMovie} from '../support/ui-helpers/add-movie'
import {editMovie} from '../support/ui-helpers/edit-movie'

test.describe('movie crud e2e stubbed', () => {
  const {name, year, rating, director} = generateMovie()
  const id = 1
  const movie: Movie = {id, name, year, rating, director}

  const {
    name: editedName,
    year: editedYear,
    rating: editedRating,
    director: editedDirector,
  } = generateMovie()

  test('should add a movie', async ({page, interceptNetworkCall}) => {
    const loadNoMovies = interceptNetworkCall({
      method: 'GET',
      url: '/movies',
      fulfillResponse: {
        status: 200,
        body: {data: []},
      },
    })

    await page.goto('/')
    await loadNoMovies

    await addMovie(page, name, year, rating, director)

    const loadPostOrGetMovies = interceptNetworkCall({
      url: '/movies',
      handler: async (route, request) => {
        if (request.method() === 'POST') {
          return route.fulfill({
            status: 200,
            body: JSON.stringify(movie),
            headers: {'Content-Type': 'application/json'},
          })
        } else if (request.method() === 'GET') {
          return route.fulfill({
            status: 200,
            body: JSON.stringify({data: [movie]}),
            headers: {'Content-Type': 'application/json'},
          })
        } else {
          return route.continue()
        }
      },
    })

    await page.getByTestId('add-movie-button').click()
    await loadPostOrGetMovies
    await loadPostOrGetMovies
  })

  test('should edit movie', async ({page, interceptNetworkCall}) => {
    const loadGetMovies = interceptNetworkCall({
      method: 'GET',
      url: '/movies',
      fulfillResponse: {
        status: 200,
        body: {data: [movie]},
      },
    })

    const loadGetMovieById = interceptNetworkCall({
      method: 'GET',
      url: '/movies/*',
      fulfillResponse: {
        status: 200,
        body: {data: movie},
      },
    })

    await page.goto('/')
    await loadGetMovies

    await page.getByTestId(`link-${id}`).click()
    await expect(page).toHaveURL(`/movies/${id}`)
    const {
      data: {data: getMovieByIdData},
    } = (await loadGetMovieById) as {data: {data: Movie}}
    expect(getMovieByIdData).toEqual(movie)

    const loadUpdateMovieById = interceptNetworkCall({
      method: 'PUT',
      url: '/movies/*',
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

  test('should delete a movie', async ({page, interceptNetworkCall}) => {
    const loadGetMovies = interceptNetworkCall({
      method: 'GET',
      url: '/movies',
      fulfillResponse: {
        status: 200,
        body: {data: [movie]},
      },
    })

    await page.goto('/')
    await loadGetMovies

    const loadDeleteMovie = interceptNetworkCall({
      method: 'DELETE',
      url: '/movies/*',
      fulfillResponse: {
        status: 200,
      },
    })

    const loadGetMoviesAfterDelete = interceptNetworkCall({
      method: 'GET',
      url: '/movies',
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
