import type {Page, Request, Response, Route} from '@playwright/test'

type FulfillResponse = {
  status?: number
  headers?: Record<string, string>
  body?: string
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
    throw new Error('The `page` argument is required for network interception')
  }

  if (fulfillResponse || handler) {
    return fulfillNetworkCall(page, method, url, fulfillResponse, handler)
  } else {
    return observeNetworkCall(page, method, url)
  }
}

/**
 * Stubs the network request matching the criteria and fulfills it with the specified response or handler.
 * @param {Page} page - The Playwright page object.
 * @param {string} [method] - The HTTP method to match.
 * @param {string} [url] - The URL pattern to match.
 * @param {FulfillResponse} [fulfillResponse] - The response to fulfill the request with.
 * @param {function} [handler] - Optional handler function for custom route handling.
 * @returns {Promise<NetworkCallResult>}
 */
async function fulfillNetworkCall(
  page: Page,
  method?: string,
  url?: string,
  fulfillResponse?: FulfillResponse,
  handler?: (route: Route, request: Request) => Promise<void> | void,
): Promise<NetworkCallResult> {
  // Set up route handler
  await page.route('**/*', async (route, request) => {
    if (matchesRequest(request, method, url)) {
      if (handler) {
        await handler(route, request)
      } else if (fulfillResponse) {
        await route.fulfill(fulfillResponse)
      }
    } else {
      await route.continue()
    }
  })

  // Wait for response
  const response = await page.waitForResponse(
    response =>
      (!method || response.request().method() === method) &&
      (!url || response.url().includes(url)) &&
      response.status() === (fulfillResponse?.status || 200),
  )

  // Get request
  const request = response.request()

  // Parse response data
  const data = fulfillResponse?.body ? JSON.parse(fulfillResponse.body) : null

  return {
    request,
    response,
    data,
    status: response.status(),
    requestJson: null,
  }
}

/**
 * Matches a URL against a pattern with optional dynamic segments.
 * @param {string} url - The URL to test.
 * @param {string} pattern - The pattern to match against (e.g., '/todos/:id').
 * @returns {boolean} - Whether the URL matches the pattern.
 */
function matchUrl(url: string, pattern: string): boolean {
  const urlSegments = url.split('/').filter(Boolean)
  const patternSegments = pattern.split('/').filter(Boolean)

  if (urlSegments.length !== patternSegments.length) return false

  return patternSegments.every(
    (segment, index) =>
      segment.startsWith(':') || segment === urlSegments[index],
  )
}

/**
 * Checks if a request matches the specified method and URL pattern.
 * @param {Request} request - The request object.
 * @param {string} [method] - The HTTP method to match.
 * @param {string} [url] - The URL pattern to match.
 * @returns {boolean} - True if the request matches the method and URL pattern.
 */
function matchesRequest(
  request: Request,
  method?: string,
  url?: string,
): boolean {
  const methodMatches = method ? request.method() === method : true
  const requestUrl = new URL(request.url()).pathname
  const urlMatches = url ? matchUrl(requestUrl, url) : true
  return methodMatches && urlMatches
}

/**
 * Observes the network request matching the criteria and returns its data.
 * @param {Page} page - The Playwright page object.
 * @param {string} [method] - The HTTP method to match.
 * @param {string} [url] - The URL pattern to match.
 * @returns {Promise<NetworkCallResult>}
 */
async function observeNetworkCall(
  page: Page,
  method?: string,
  url?: string,
): Promise<NetworkCallResult> {
  const request = await page.waitForRequest(
    req =>
      (!method || req.method() === method) && (!url || req.url().includes(url)),
  )

  const response = await request.response()
  if (!response) throw new Error('No response received for the request')

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
