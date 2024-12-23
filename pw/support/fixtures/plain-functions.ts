import type {APIRequestContext, APIResponse} from '@playwright/test'

/**
 * Simplified helper for making API requests and returning the status and JSON body.
 * This helper automatically performs the request based on the provided method, URL, body, and headers.
 *
 * @param {Object} params - The parameters for the request.
 * @param {APIRequestContext} params.request - The Playwright request object, used to make the HTTP request.
 * @param {string} params.method - The HTTP method to use (POST, GET, PUT, DELETE).
 * @param {string} params.url - The URL to send the request to.
 * @param {Record<string, unknown> | null} [params.body=null] - The body to send with the request (for POST and PUT requests).
 * @param {Record<string, string> | undefined} [params.headers=undefined] - The headers to include with the request.
 * @returns {Promise<{ status: number; body: unknown }>} - An object containing the status code and the parsed response body.
 *    - `status`: The HTTP status code returned by the server.
 *    - `body`: The parsed JSON response body from the server.
 */
export async function apiRequest({
  request,
  method,
  url,
  body = null,
  headers,
}: {
  request: APIRequestContext
  method: 'POST' | 'GET' | 'PUT' | 'DELETE'
  url: string
  body?: Record<string, unknown> | null
  headers?: Record<string, string>
}): Promise<{status: number; body: unknown}> {
  let response: APIResponse

  // Common request options
  const options: {
    data?: Record<string, unknown> | null
    headers?: Record<string, string>
  } = {}
  if (body) options.data = body
  if (headers) options.headers = headers

  // Make the request based on the method
  switch (method.toUpperCase()) {
    case 'POST':
      response = await request.post(url, options)
      break
    case 'GET':
      response = await request.get(url, {headers})
      break
    case 'PUT':
      response = await request.put(url, options)
      break
    case 'DELETE':
      response = await request.delete(url, {headers})
      break
    default:
      throw new Error(`Unsupported HTTP method: ${method}`)
  }

  const bodyJson = await response.json()
  const status = response.status()

  return {status, body: bodyJson}
}
