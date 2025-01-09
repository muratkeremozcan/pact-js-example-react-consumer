// import {test, expect} from '@playwright/experimental-ct-react'
// import MovieDetails from './movie-details'
// import {generateMovie} from '@support/factories'
// import {interceptNetworkCall} from '@pw/support/utils/network'

// test.describe('<MovieDetails />', () => {
//   const id = 123
//   const movieName = 'The Godfather 123'
//   const movie = {id, ...generateMovie(), name: movieName}

//   test('should display the default error with delay', async ({mount, page}) => {
//     const error = 'Unexpected error occurred'

//     // Intercept GET request with error response
//     const loadNetworkError = interceptNetworkCall({
//       page,
//       method: 'GET',
//       url: `/movies/${id}`,
//       fulfillResponse: {
//         status: 400,
//         body: {error},
//       },
//     })

//     const c = await mount(<MovieDetails />, {
//       hooksConfig: {route: `/${id}`, path: '/:id'},
//     })

//     await c.getByTestId('loading-message-comp').waitFor()

//     const {responseJson} = await loadNetworkError
//     expect(responseJson).toMatchObject({error})

//     await expect(c.locator(`text=${error}`)).toBeVisible()
//   })

//   test('should display a specific error', async ({mount, page}) => {
//     const error = 'Movie not found'

//     // Intercept GET request with specific error
//     const loadNetworkError = interceptNetworkCall({
//       page,
//       method: 'GET',
//       url: `/movies/${id}`,
//       fulfillResponse: {
//         status: 400,
//         body: JSON.stringify({
//           error: {
//             error,
//           },
//         }),
//       },
//     })

//     const c = await mount(<MovieDetails />, {
//       hooksConfig: {route: `/${id}`, path: '/:id'},
//     })

//     const {responseJson} = await loadNetworkError
//     expect(responseJson.error.error).toBe(error)

//     await expect(c.locator(`text=${error}`)).toBeVisible()
//   })

//   test('should make a unique network call when the route takes an id', async ({
//     mount,
//     page,
//   }) => {
//     const loadGetMovieById = interceptNetworkCall({
//       page,
//       method: 'GET',
//       url: `/movies/${id}`,
//       fulfillResponse: {
//         body: JSON.stringify({data: movie}),
//       },
//     })

//     const c = await mount(<MovieDetails />, {
//       hooksConfig: {route: `/${id}`, path: '/:id'},
//     })

//     const {responseJson} = await loadGetMovieById
//     expect(responseJson.data).toMatchObject(movie)
//   })

//   test('should make a unique network call when the route takes a query parameter', async ({
//     mount,
//     page,
//   }) => {
//     const route = `/movies?name=${encodeURIComponent(movieName)}`

//     const loadGetMovieByName = interceptNetworkCall({
//       page,
//       method: 'GET',
//       url: route,
//       fulfillResponse: {
//         body: JSON.stringify({data: movie}),
//       },
//     })

//     const c = await mount(<MovieDetails />, {
//       hooksConfig: {route, path: '/movies'},
//     })

//     const {responseJson} = await loadGetMovieByName
//     expect(responseJson.data).toMatchObject(movie)
//   })
// })
