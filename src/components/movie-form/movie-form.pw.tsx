import {test, expect} from '@playwright/experimental-ct-react'
import type {MountResult} from '@playwright/experimental-ct-react'
import MovieForm from './movie-form'
import {generateMovie} from '@cypress/support/factories'
import {interceptNetworkCall} from '@pw/support/utils/network'

test.describe('<MovieForm />', () => {
  const fillName = async (c: MountResult, name: string) =>
    c.getByPlaceholder('Movie name').fill(name)

  const fillYear = async (c: MountResult, year: string) =>
    c.getByPlaceholder('Movie year').fill(year)

  const fillRating = async (c: MountResult, rating: string) =>
    c.getByPlaceholder('Movie rating').fill(rating)

  const fillDirector = async (c: MountResult, director: string) =>
    c.getByPlaceholder('Movie director').fill(director)

  test('should fill the form and add the movie', async ({mount, page}) => {
    const {name, year, rating, director} = generateMovie()

    const c = await mount(<MovieForm />)
    await fillName(c, name)
    await fillYear(c, String(year))
    await fillRating(c, String(rating))
    await fillDirector(c, director)

    const loadPostMovie = interceptNetworkCall({
      method: 'POST',
      url: '/movies',
      page,
      fulfillResponse: {
        status: 200,
      },
    })

    await c.getByText('Add Movie').click()
    const {requestJson} = await loadPostMovie
    console.log(requestJson)
    expect(requestJson).toEqual({
      name,
      year,
      rating,
      director,
    })

    await expect(c.getByPlaceholder('Movie name')).toHaveValue('')
    await expect(c.getByPlaceholder('Movie year')).toHaveValue('2023')
    await expect(c.getByPlaceholder('Movie rating')).toHaveValue('0')
  })

  test('should exercise validation errors', async ({mount}) => {
    const c = await mount(<MovieForm />)

    await fillYear(c, '2025')
    await c.getByText('Add Movie').click()

    const validationError = c.getByTestId('validation-error')
    expect(validationError).toHaveCount(3)

    await fillYear(c, '1899')
    await c.getByText('Add Movie').click()
    await expect(
      c.getByText('Number must be greater than or equal to 1900'),
    ).toBeVisible()

    await fillYear(c, '2024')
    await fillName(c, '4')
    await fillDirector(c, 'Christopher Nolan')
    await c.getByText('Add Movie').click()
    expect(validationError).toHaveCount(0)

    await fillYear(c, '1900')
    await fillName(c, '4')
    await fillDirector(c, 'Christopher Nolan')
    await c.getByText('Add Movie').click()
    expect(validationError).toHaveCount(0)
  })
})
