import type {JsonMap} from '@pact-foundation/pact/src/common/jsonTypes'
import type {V4ResponseBuilder} from '@pact-foundation/pact/src/v4/http/types'

/**
 * Converts an object with arbitrary value types to a `JsonMap` where all values are compatible with Pact's expectations.
 * This is useful for ensuring compatibility with functions that expect all values in the map to be of specific types,
 * such as in Pact state management.
 *
 * The function handles various data types as follows:
 * - `null` and `undefined`: Converted to the string `"null"`.
 * - `object`: Serialized using `JSON.stringify` unless it's a Date or Array.
 * - `number` and `boolean`: Preserved as is, ensuring numeric and boolean types remain unaltered.
 * - `Date`: Converted to an ISO string format (`toISOString()`).
 * - `Array`: Preserved in its original form, as arrays should not be converted to strings.
 *
 * @param {Record<string, unknown>} obj - The object to convert, with string keys and values of any type.
 * @returns {JsonMap} - A new object where all values are in a format compatible with Pact.
 *
 * @example
 * const movie = { name: 'Inception', year: 2010, released: new Date(), tags: ['Sci-Fi', 'Thriller'], director: { firstName: 'Christopher', lastName: 'Nolan' } }
 * toJsonMap(movie) // { name: 'Inception', year: 2010, released: '2024-09-01T12:00:00.000Z', tags: ['Sci-Fi', 'Thriller'], director: '{"firstName":"Christopher","lastName":"Nolan"}' }
 */
const toJsonMap = (obj: Record<string, unknown>): JsonMap =>
  Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      if (value === null || value === undefined) {
        return [key, 'null']
      } else if (
        typeof value === 'object' &&
        !(value instanceof Date) &&
        !Array.isArray(value)
      ) {
        return [key, JSON.stringify(value)]
      } else if (typeof value === 'number' || typeof value === 'boolean') {
        return [key, value] // Preserve numbers and booleans
      } else if (value instanceof Date) {
        return [key, value.toISOString()] // Convert dates to ISO strings
      } else {
        return [key, String(value)]
      }
    }),
  )

type ProviderStateInput = {
  name: string
  params: Record<string, unknown>
}

/**
 * Creates a tuple representing a provider state for use with Pact.
 * The function takes a state name and an object of parameters, converting
 * the parameters into a JsonMap where all values are strings.
 *
 * This function is useful for simplifying the setup of provider states in tests
 * by ensuring the parameters are in the correct format required by Pact.
 *
 * @param {Object} options - The options for creating the provider state.
 * @param {string} options.name - The name of the provider state.
 * @param {Record<string, unknown>} options.params - The parameters for the provider state, with string keys and values of any type.
 *
 * @returns {[string, JsonMap]} - A tuple containing the state name and the converted parameters.
 *
 * @example
 *  * const movie: Movie = {
 *   name: 'My existing movie',
 *   year: 2001
 * }
 *
 * const state = createProviderState({
 *   name: 'An existing movie exists',
 *   params: movie
 * })
 *
 * provider.given(...state)
 *
 * // OR
 *
 * const [stateName, stateParams] = createProviderState({
 *   name: 'An existing movie exists',
 *   params: movie
 * })
 *
 * provider.given(stateName, stateParams)
 */
export const createProviderState = ({
  name,
  params,
}: ProviderStateInput): [string, JsonMap] => [name, toJsonMap(params)]

/**
 * Utility function to set a JSON body on a Pact V4 response.
 *
 * This improves readability using currying and supports any JSON-serializable value.
 *
 * @param {unknown} body - The JSON body object to set in the response, which can be any serializable structure.
 * @returns {(builder: V4ResponseBuilder) => V4ResponseBuilder} - A function to set the JSON body.
 *
 * Example usage:
 * ```js
 * // Before
 * .willRespondWith(200, (builder) => builder.jsonBody({
 *   id: integer(),
 *   name: string(name),
 *   year: integer(year)
 * }))
 *
 * // After
 * .willRespondWith(200, setJsonBody({
 *   id: integer(),
 *   name: string(name),
 *   year: integer(year)
 * }))
 * ```
 */
export const setJsonBody = (body: unknown) => (builder: V4ResponseBuilder) =>
  builder.jsonBody(body)
