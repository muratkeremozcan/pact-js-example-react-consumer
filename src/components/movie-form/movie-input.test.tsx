import React from 'react'
import {describe, it, expect, vi} from 'vitest'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MovieInput from './movie-input'
import {generateMovie} from '../../../cypress/support/factories'

describe('<MovieInput />', () => {
  it('should render a name input', async () => {
    const movie = generateMovie()
    const onChange = vi.fn()

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

    const user = userEvent.setup()
    await user.type(input, 'a')
    expect(onChange).toHaveBeenCalled()
  })

  it('should render a year input', async () => {
    const movie = generateMovie()
    const onChange = vi.fn()

    render(
      <MovieInput
        type="number"
        value={movie.year}
        onChange={onChange}
        placeholder="place holder"
      />,
    )

    const input = screen.getByPlaceholderText('place holder')
    expect(input).toBeVisible()
    expect(input).toHaveValue(movie.year)

    const user = userEvent.setup()
    await user.type(input, '1')
    expect(onChange).toHaveBeenCalled()
  })
})
