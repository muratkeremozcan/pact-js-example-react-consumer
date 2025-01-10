import {test, expect} from '@playwright/experimental-ct-react'
import MovieDetails from './movie-details'
import {generateMovie} from '@support/factories'
import {interceptNetworkCall} from '@pw/support/utils/network'

test.describe('<MovieDetails />', () => {
  const id = 123
  const movieName = 'The Godfather 123'
  const movie = {id, ...generateMovie(), name: movieName}

  test('should display the default error with delay', async ({mount, page}) => {
    const error = 'Unexpected error occurred'

    const loadNetworkError = interceptNetworkCall({
      page,
      method: 'GET',
      url: `/movies/${id}`,
      fulfillResponse: {
        status: 400,
        body: {error},
      },
    })

    const c = await mount(<MovieDetails />, {
      hooksConfig: {path: '/:id', route: `/${id}`},
    })

    // loading state in PW ct is handled differently than in Cypress
    // due to how React Suspense and the test runners interact.
    // so, this fails
    // await expect(c.getByTestId('loading-message-comp')).toBeVisible()
    const {responseJson} = await loadNetworkError
    expect(responseJson).toMatchObject({error})

    await expect(c.getByText(error)).toBeVisible()
  })

  test('should display a specific error', async ({mount, page}) => {
    const error = 'Movie not found'

    const loadNetworkError = interceptNetworkCall({
      page,
      method: 'GET',
      url: `/movies/${id}`,
      fulfillResponse: {
        status: 400,
        body: {
          error: {
            error,
          },
        },
      },
    })

    const c = await mount(<MovieDetails />, {
      hooksConfig: {path: '/:id', route: `/${id}`},
    })

    const {responseJson} = await loadNetworkError
    expect(responseJson).toMatchObject({
      error: {
        error,
      },
    })

    await expect(c.getByText(error)).toBeVisible()
  })

  test('should make a unique network call when the route takes an id', async ({
    mount,
    page,
  }) => {
    const loadGetMovieById = interceptNetworkCall({
      page,
      method: 'GET',
      url: `/movies/${id}`,
      fulfillResponse: {
        body: {data: movie},
      },
    })

    await mount(<MovieDetails />, {
      hooksConfig: {route: `/${id}`, path: '/:id'},
    })

    const {responseJson} = await loadGetMovieById
    expect(responseJson).toMatchObject({data: movie})
  })

  test('should make a unique network call when the route takes a query parameter', async ({
    mount,
    page,
  }) => {
    const route = `/movies?name=${encodeURIComponent(movieName)}`

    const loadGetMovieByName = interceptNetworkCall({
      page,
      method: 'GET',
      url: route,
      fulfillResponse: {
        body: {data: movie},
      },
    })

    await mount(<MovieDetails />, {
      hooksConfig: {route, path: '/movies'},
    })

    const {responseJson} = await loadGetMovieByName
    expect(responseJson).toMatchObject({data: movie})
  })
})
