import {
  wrappedRender,
  screen,
  waitFor,
  worker,
  http,
  describe,
  it,
  expect,
  userEvent,
} from '@vitest-utils/utils'
import MovieForm from './movie-form'
import {generateMovie} from '../../../cypress/support/factories'

describe('<MovieForm />', () => {
  const user = userEvent.setup()

  const fillYear = async (year: number) => {
    const yearInput = screen.getByPlaceholderText('Movie year')
    await user.clear(yearInput)
    await user.type(yearInput, String(year))
  }

  const fillName = async (name: string) => {
    const nameInput = screen.getByPlaceholderText('Movie name')
    await user.type(nameInput, name)
  }

  const fillRating = async (rating: number) => {
    const ratingInput = screen.getByPlaceholderText('Movie rating')
    await user.clear(ratingInput)
    await user.type(ratingInput, String(rating))
  }

  const fillDirector = async (director: string) => {
    const directorInput = screen.getByPlaceholderText('Movie director')
    await user.type(directorInput, director)
  }

  it('should fill the form and add the movie', async () => {
    // Setup MSW handler for this test
    worker.use(
      http.post('http://localhost:3001/movies', async ({request}) => {
        const data = await request.json()
        return new Response(JSON.stringify(data), {
          status: 200,
        })
      }),
    )

    wrappedRender(<MovieForm />)
    const nameInput = screen.getByPlaceholderText('Movie name')
    const yearInput = screen.getByPlaceholderText('Movie year')
    const ratingInput = screen.getByPlaceholderText('Movie rating')
    const directorInput = screen.getByPlaceholderText('Movie director')
    const addButton = screen.getByRole('button', {name: /add movie/i})

    const {name, year, rating, director} = generateMovie()

    await fillName(name)
    await fillYear(year)
    await fillRating(rating)
    await fillDirector(director)

    await user.click(addButton)

    // Verify form reset
    await waitFor(() => {
      expect(nameInput).toHaveValue('')
      expect(yearInput).toHaveValue(2023)
      expect(ratingInput).toHaveValue(0)
      expect(directorInput).toHaveValue('')
    })
  })

  it('should exercise validation errors', async () => {
    wrappedRender(<MovieForm />)
    const addButton = screen.getByRole('button', {name: /add movie/i})

    // Test with year 2025 - should show 3 errors
    await fillYear(2025)
    await user.click(addButton)
    const validationErrors = screen.getAllByTestId('validation-error')
    expect(validationErrors).toHaveLength(3)

    // Test with year 1899 - should show 3 errors
    await fillYear(1899)
    await user.click(addButton)
    const moreValidationErrors = screen.getAllByTestId('validation-error')
    expect(moreValidationErrors).toHaveLength(3)

    // Test with valid data - should show no errors
    await fillYear(2024)
    await fillName('4')
    await fillDirector('Christopher Nolan')
    await user.click(addButton)
    expect(screen.queryByTestId('validation-error')).not.toBeInTheDocument()

    // Test with lower bound - should show no errors
    await fillYear(1900)
    await fillName('4')
    await fillDirector('Christopher Nolan')
    await user.click(addButton)
    expect(screen.queryByTestId('validation-error')).not.toBeInTheDocument()
  })
})