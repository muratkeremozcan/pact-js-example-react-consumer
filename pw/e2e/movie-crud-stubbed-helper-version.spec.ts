import {generateMovie} from '../../cypress/support/factories'
import type {Movie} from '../../src/consumer'
import {expect, test} from '../support/fixtures'
import {addMovie} from '../support/helpers/add-movie'
import {interceptNetworkCall} from '../support/utils/network'

test.describe('movie crud e2e stubbed', () => {
  // Generate initial movie data
  const {name, year, rating, director} = generateMovie()
  const id = 1
  const movie: Movie = {id, name, year, rating, director}

  // Generate edited movie data
  // const {
  //   name: editedName,
  //   year: editedYear,
  //   rating: editedRating,
  //   director: editedDirector,
  // } = generateMovie()

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
      url: '/movies',
      page,
      fulfillResponse: {
        status: 200,
        body: {data: [movie]},
      },
    })

    // TODO: make this work
    // const loadGetMovieById = interceptNetworkCall({
    //   page,
    //   method: 'GET',
    //   url: `/movies/${id}`,
    //   fulfillResponse: {
    //     status: 200,
    //     body: {data: movie},
    //   },
    // })

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
    await getMovieByIdResponse
  })
})
