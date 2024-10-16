import type { AppRouter } from "@acme/checkout-api-pages"
import { createTRPCProxyClient, httpBatchLink, loggerLink } from "@trpc/client"
import { createTRPCNext } from "@trpc/next"
import superjson from "superjson"

const getBaseUrl = () => {
  if (typeof window !== "undefined") return "" // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}` // SSR should use vercel url

  return `http://localhost:3000` // dev SSR should use localhost
}

export const api = createTRPCNext<AppRouter>({
  config() {
    return {
      transformer: superjson,
      links: [
        loggerLink({
          enabled: (opts) => process.env.NODE_ENV === "development" || (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/pages-trpc`,
        }),
      ],
    }
  },
  ssr: false,
})

export { type RouterInputs, type RouterOutputs } from "@acme/checkout-api-pages"
// https://trpc.io/docs/client/setup
export const proxyClient = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    loggerLink({
      enabled: (opts) => process.env.NODE_ENV === "development" || (opts.direction === "down" && opts.result instanceof Error),
      // enabled: (opts) => true,
    }),
    httpBatchLink({
      url: `${getBaseUrl()}/api/pages-trpc`,
    }),
  ],
})
