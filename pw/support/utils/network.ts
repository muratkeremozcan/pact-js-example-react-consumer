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
    throw new Error('Page is required')
  }

  const preparedResponse = prepareResponse(fulfillResponse)
  const responsePromise = new Promise<NetworkCallResult>((resolve, reject) => {
    const handleResponse = async (response: Response) => {
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

    // Convert URL to glob pattern if it starts with **
    const routePattern = url?.startsWith('**') ? url : `**${url}`

    // Set up route handler first
    page
      .route(routePattern || '**', async (route, request) => {
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
      .catch(reject)

    // Then wait for response
    page
      .waitForResponse(response =>
        matchesRequest(response.request(), method, url),
      )
      .then(handleResponse)
      .then(resolve)
      .catch(reject)
  })

  return responsePromise
}

/**
 * Matches a request against the specified method and URL pattern.
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
  if (method && request.method() !== method) {
    return false
  }

  if (url) {
    const requestUrl = request.url()
    // Handle both exact matches and glob patterns
    if (url.includes('*')) {
      const pattern = url.startsWith('**') ? url.slice(2) : url
      return requestUrl.includes(pattern.replace(/\*/g, ''))
    }
    return requestUrl.includes(url)
  }

  return true
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
