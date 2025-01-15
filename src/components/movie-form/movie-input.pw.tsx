import {test, expect} from '@playwright/experimental-ct-react'
import MovieInput from './movie-input'
import {generateMovie} from '@support/factories'
import sinon from 'sinon'

test.describe('<MovieInput>', () => {
  const movie = generateMovie()

  const sandbox = sinon.createSandbox()
  const onChange = sandbox.stub()

  test.afterEach(() => {
    sandbox.restore()
  })

  test('should render a name input', async ({mount}) => {
    const {name} = movie

    const c = await mount(
      <MovieInput
        type="text"
        value={name}
        placeholder="place holder"
        onChange={onChange}
      />,
    )
    const input = await c.getByPlaceholder('place holder')
    await expect(input).toBeVisible()
    await expect(input).toHaveValue(name)

    // PW is in beta
    // await input.fill('a') // enabling this fails the test
    // const call = onChange.firstCall
    // expect(call.args[0].nativeEvent.data).toBe('a')
  })

  test('should render a year input', async ({mount}) => {
    const {year} = movie

    const c = await mount(
      <MovieInput
        type="number"
        value={year}
        onChange={onChange}
        placeholder="place holder"
      />,
    )

    const input = await c.getByPlaceholder('place holder')
    await expect(input).toBeVisible()
    await expect(input).toHaveValue(String(year))

    // PW is in beta
    // await input.fill('1') // enabling this fails the test
    // const call = onChange.firstCall
    // expect(call.args[0].nativeEvent.data).toBe('1')
  })
})
