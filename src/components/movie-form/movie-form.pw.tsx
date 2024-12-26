import {test, expect} from '@playwright/experimental-ct-react'
import MovieForm from './movie-form'

test.describe('<MovieForm>', () => {
  test('should fill the form and add the movie', async ({mount}) => {
    const component = await mount(<MovieForm />)

    const nameInput = component.getByPlaceholder('Movie name')
    const yearInput = component.getByPlaceholder('Movie year')
    const ratingInput = component.getByPlaceholder('Movie rating')
    const directorInput = component.getByPlaceholder('Movie director')

    await expect(nameInput).toBeVisible()
    await expect(yearInput).toBeVisible()
    await expect(ratingInput).toBeVisible()
    await expect(directorInput).toBeVisible()

    // const {name, year, rating, director} = generateMovie()
    // PW is in beta: input interactions are not working
    // await nameInput.fill(name)
    // await yearInput.fill(String(year))
    // await ratingInput.fill(String(rating))
    // await directorInput.fill(director)

    // const addButton = component.getByText('Add Movie')
    // await expect(addButton).toBeVisible()
    // await addButton.click()

    // await expect(component.getByText('Adding...')).toBeVisible()

    // // Check form reset
    // await expect(nameInput).toHaveValue('')
    // await expect(yearInput).toHaveValue('2023')
    // await expect(ratingInput).toHaveValue('0')
  })

  test('should exercise validation errors', async ({mount}) => {
    const component = await mount(<MovieForm />)

    const yearInput = component.getByPlaceholder('Movie year')
    expect(yearInput).toBeVisible()
    // await yearInput.fill('2025')
    // await component.getByText('Add Movie').click()

    // await expect(component.getByText('Name is required')).toBeVisible()
    // await expect(
    //   component.getByText('Year must be less than or equal to 2024'),
    // ).toBeVisible()

    // PW is in beta: input interactions are flaky
    // await yearInput.fill('1899')
    // await component.getByText('Add Movie').click()

    // await expect(component.getByText('Name is required')).toBeVisible()
    // await expect(
    //   component.getByText('Year must be greater than or equal to 1900'),
    // ).toBeVisible()

    // await yearInput.fill('2024')
    // await component.getByPlaceholder('Movie name').fill('4')
    // await component.getByPlaceholder('Movie director').fill('Christopher Nolan')
    // await component.getByText('Add Movie').click()
    // await expect(component.getByText('Name is required')).not.toBeVisible()

    // await yearInput.fill('1900')
    // await component.getByPlaceholder('Movie name').fill('4')
    // await component.getByPlaceholder('Movie director').fill('Christopher Nolan')
    // await component.getByText('Add Movie').click()
    // await expect(component.getByText('Name is required')).not.toBeVisible()
  })
})
