// support/utils/network.ts
import type {Page, Request, Response, Route} from '@playwright/test'
import picomatch from 'picomatch'

type FulfillResponse = {
  status?: number
  headers?: Record<string, string>
  body?: unknown // Can be string, Buffer, or object
}

type PreparedResponse = {
  status?: number
  headers?: Record<string, string>
  body?: string | Buffer
}

type InterceptOptions = {
  method?: string
  url?: string
  page: Page
  fulfillResponse?: FulfillResponse
  handler?: (route: Route, request: Request) => Promise<void> | void
}

type NetworkCallResult = {
  request: Request | null
  response: Response | null
  data: unknown
  status: number
  requestJson: unknown
}

export type InterceptNetworkCall = ReturnType<typeof interceptNetworkCall>

/**
 * Intercepts a network request matching the given criteria.
 * - If `fulfillResponse` is provided, stubs the request and fulfills it with the given response.
 * - If `handler` is provided, uses it to handle the route.
 * - Otherwise, observes the request and returns its data.
 * @param {InterceptOptions} options - Options for matching and handling the request.
 * @returns {Promise<NetworkCallResult>}
 */
export async function interceptNetworkCall({
  method,
  url,
  page,
  fulfillResponse,
  handler,
}: InterceptOptions): Promise<NetworkCallResult> {
  if (!page) {
    throw new Error('Page is required')
  }

  const preparedResponse = prepareResponse(fulfillResponse)

  // Set up route handler if needed
  if (handler || fulfillResponse) {
    const routePattern = url?.startsWith('**') ? url : `**${url}`
    await page.route(routePattern || '**', async (route, request) => {
      if (!matchesRequest(request, method, url)) {
        return route.continue()
      }

      if (handler) {
        await handler(route, request)
      } else if (preparedResponse) {
        await route.fulfill(preparedResponse)
      } else {
        await route.continue()
      }
    })
  }

  // Wait for response
  const response = await page.waitForResponse(res =>
    matchesRequest(res.request(), method, url),
  )

  const request = response.request()
  let data = null
  let requestJson = null

  if (fulfillResponse?.body) {
    // If we have a fulfillResponse, use that directly
    data =
      typeof fulfillResponse.body === 'string'
        ? JSON.parse(fulfillResponse.body)
        : fulfillResponse.body
  } else {
    try {
      const contentType = response.headers()['content-type']
      if (contentType?.includes('application/json')) {
        data = await response.json()
      }
    } catch {
      // Response is not JSON
    }
  }

  try {
    requestJson = await request.postDataJSON()
  } catch {
    // Request has no post data or is not JSON
  }

  return {
    request,
    response,
    data,
    status: response.status(),
    requestJson,
  }
}

function createUrlMatcher(pattern?: string): (url: string) => boolean {
  if (!pattern) return () => true

  // Split pattern into path and query if it contains a question mark
  const [pathPattern, queryPattern] = pattern.split('?')

  // Convert URL pattern to glob pattern if needed
  const globPattern = pathPattern?.startsWith('**')
    ? pathPattern
    : `**${pathPattern}`
  const isMatch = picomatch(globPattern)

  return (url: string) => {
    // Split URL into path and query
    const [urlPath, urlQuery] = url.split('?')

    // Check if path matches
    const pathMatches = isMatch(urlPath as string)

    // If there's no query pattern, just check the path
    if (!queryPattern) return pathMatches

    // If there's a query pattern but no query in URL, no match
    if (!urlQuery) return false

    // For query parameters, just check if it starts with the pattern
    // This allows matching '/movies?' to match '/movies?name=something'
    return pathMatches && urlQuery.startsWith(queryPattern)
  }
}

function matchesRequest(
  request: Request,
  method?: string,
  urlPattern?: string,
): boolean {
  const matchesMethod = !method || request.method() === method
  const matchesUrl = createUrlMatcher(urlPattern)(request.url())
  return matchesMethod && matchesUrl
}

/**
 * Prepares the response by stringifying the body if it's an object and setting appropriate headers.
 * @param {FulfillResponse} fulfillResponse - The response details.
 * @returns {PreparedResponse | undefined} - The prepared response.
 */
export function prepareResponse(
  fulfillResponse?: FulfillResponse,
): PreparedResponse | undefined {
  if (!fulfillResponse) return undefined

  const {status = 200, headers = {}, body} = fulfillResponse
  const contentType = headers['Content-Type'] || 'application/json'

  return {
    status,
    headers: {
      'Content-Type': contentType,
      ...headers,
    },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  }
}

/**
 * Observes the network request matching the criteria and returns its data.
 * @param {Page} page - The Playwright page object.
 * @param {string} [method] - The HTTP method to match.
 * @param {string} [url] - The URL pattern to match.
 * @returns {Promise<NetworkCallResult>}
 */
export async function observeNetworkCall(
  page: Page,
  method?: string,
  url?: string,
): Promise<NetworkCallResult> {
  const response = await page.waitForResponse(
    res =>
      (!method || res.request().method() === method) &&
      (!url || createUrlMatcher(url)(res.url())),
  )

  const request = response.request()
  const status = response.status()

  let data: unknown = null
  try {
    data = await response.json()
  } catch {
    // Response is not JSON; ignore
  }

  let requestJson: unknown = null
  try {
    requestJson = await request.postDataJSON()
  } catch {
    // Request has no post data or is not JSON; ignore
  }

  return {request, response, data, status, requestJson}
}
