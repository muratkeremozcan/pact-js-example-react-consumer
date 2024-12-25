// support/utils/network.ts
import type {Page, Request, Response, Route} from '@playwright/test'

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
    throw new Error('The `page` argument is required for network interception')
  }

  if (fulfillResponse || handler) {
    return fulfillNetworkCall(page, method, url, fulfillResponse, handler)
  } else {
    return observeNetworkCall(page, method, url)
  }
}

/**
 * Prepares the response by stringifying the body if it's an object and setting appropriate headers.
 * @param {FulfillResponse} fulfillResponse - The response details.
 * @returns {PreparedResponse | undefined} - The prepared response.
 */
function prepareResponse(
  fulfillResponse?: FulfillResponse,
): PreparedResponse | undefined {
  if (!fulfillResponse) return undefined

  const headers = {
    'Content-Type': 'application/json',
    ...fulfillResponse.headers,
  }

  let body: string | Buffer | undefined = undefined
  if (fulfillResponse.body !== undefined) {
    if (
      typeof fulfillResponse.body === 'object' &&
      fulfillResponse.body !== null &&
      !Buffer.isBuffer(fulfillResponse.body)
    ) {
      body = JSON.stringify(fulfillResponse.body)
    } else {
      body = fulfillResponse.body as string | Buffer
    }
  }

  return {
    ...fulfillResponse,
    headers,
    body,
  }
}

/**
 * Stubs the network request matching the criteria and fulfills it with the specified response or handler.
 * Automatically stringifies the body if it's an object and sets the Content-Type header.
 * Removes the route handler after fulfilling to allow subsequent intercepts.
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
  // Define a predicate for matching the request
  const predicate = (route: Route) =>
    matchesRequest(route.request(), method, url)

  // Define the route handler
  const routeHandler = async (route: Route) => {
    if (predicate(route)) {
      if (handler) {
        await handler(route, route.request())
      } else if (fulfillResponse) {
        const prepared = prepareResponse(fulfillResponse)
        if (prepared) {
          await route.fulfill(prepared)
        }
      }
      // Remove this specific handler after fulfilling
      await page.unroute('**/*', routeHandler)
    } else {
      await route.continue()
    }
  }

  // Set up the route
  await page.route('**/*', routeHandler)

  // Wait for the response
  const response = await page.waitForResponse(
    resp =>
      (!method || resp.request().method() === method) &&
      (!url || resp.url().includes(url)) &&
      resp.status() === (fulfillResponse?.status || 200),
  )

  // Get request details
  const request = response.request()

  // Parse response data
  let data: unknown = null
  if (fulfillResponse?.body !== undefined) {
    if (
      typeof fulfillResponse.body === 'string' ||
      Buffer.isBuffer(fulfillResponse.body)
    ) {
      try {
        data = JSON.parse(fulfillResponse.body.toString())
      } catch {
        data = fulfillResponse.body
      }
    } else {
      data = fulfillResponse.body
    }
  }

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
 * @param {string} url - The URL pathname to test.
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
export async function observeNetworkCall(
  page: Page,
  method?: string,
  url?: string,
): Promise<NetworkCallResult> {
  const request = await page.waitForRequest(
    req =>
      (!method || req.method() === method) && (!url || req.url().includes(url)),
  )

  const response = await request.response()
  if (!response)
    throw new Error(
      `No response received for ${request.method()} ${request.url()}`,
    )

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
