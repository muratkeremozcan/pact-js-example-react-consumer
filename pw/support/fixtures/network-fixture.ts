import {test as base} from '@playwright/test'
import type {Route, Request} from '@playwright/test'
import {
  interceptNetworkCall as interceptNetworkCallOriginal,
  type InterceptOptions,
} from '../utils/network'

//  Shared Types
type InterceptNetworkCallOptions = {
  method?: string
  url?: string
  fulfillResponse?: InterceptOptions['fulfillResponse']
  handler?: (route: Route, request: Request) => Promise<void> | void
}

// Define the function signature as a type
type InterceptNetworkCallFn = (
  options: InterceptNetworkCallOptions,
) => ReturnType<typeof interceptNetworkCallOriginal>

//  grouping them all together
export type InterceptNetworkMethods = {
  interceptNetworkCall: InterceptNetworkCallFn
}

export const test = base.extend<InterceptNetworkMethods>({
  interceptNetworkCall: async ({page}, use) => {
    const interceptNetworkCallFn: InterceptNetworkCallFn = ({
      method,
      url,
      fulfillResponse,
      handler,
    }: InterceptNetworkCallOptions) =>
      interceptNetworkCallOriginal({
        page,
        method,
        url,
        fulfillResponse,
        handler,
      })

    await use(interceptNetworkCallFn)
  },
})
