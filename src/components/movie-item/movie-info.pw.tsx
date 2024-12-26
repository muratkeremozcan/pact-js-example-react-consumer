import {test, expect} from '@playwright/experimental-ct-react'
import MovieInfo from './movie-info'

test.describe('<MovieInfo />', () => {
  test('should verify the movie and delete', async ({mount}) => {
    const id = 1
    const name = 'Inception'
    const year = 2010
    const rating = 8.5
    const director = 'Christopher Nolan'
    const movie = {id, name, year, rating, director}

    const component = await mount(<MovieInfo movie={movie} />)

    await expect(component.getByText(`ID: ${id}`)).toBeVisible()
    await expect(component.getByText(name)).toBeVisible()
    await expect(component.getByText(String(year))).toBeVisible()
    await expect(component.getByText(String(rating))).toBeVisible()
  })
})
