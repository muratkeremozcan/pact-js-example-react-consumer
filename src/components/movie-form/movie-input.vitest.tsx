import {describe, it, expect, vi} from 'vitest'
import {screen} from '@testing-library/react'
import {render} from 'vitest-browser-react'
import userEvent from '@testing-library/user-event'
import MovieInput from './movie-input'
import {generateMovie} from '../../../cypress/support/factories'

describe('MovieInput', () => {
  const movie = generateMovie()
  const onChange = vi.fn()
  const user = userEvent.setup()

  it('should render a text input', async () => {
    render(
      <MovieInput
        type="text"
        value={movie.name}
        onChange={onChange}
        placeholder="place holder"
      />,
    )

    const input = screen.getByPlaceholderText('place holder')
    expect(input).toBeVisible()
    expect(input).toHaveValue(movie.name)

    await user.type(input, 'test movie')
    expect(onChange).toHaveBeenCalled()
  })

  it('should render a year input', async () => {
    render(
      <MovieInput
        type="number"
        value={movie.year}
        onChange={onChange}
        placeholder="place holder"
      />,
    )

    const input = screen.getByTestId('movie-input-comp-number')
    expect(input).toBeVisible()
    expect(input).toHaveValue(movie.year)

    await user.type(input, '1')
    expect(onChange).toHaveBeenCalled()
  })
})
