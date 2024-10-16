import { tg } from "@acme/analytics-telegram"
import { appRouter, createTRPCContext } from "@acme/checkout-api-pages"
import { createNextApiHandler } from "@trpc/server/adapters/next"

// export API handler
export default createNextApiHandler({
  router: appRouter,

  createContext: createTRPCContext,
  onError({ error, type, path, ctx, req }) {
    // See docs on loggerLink
    //  - https://trpc.io/docs/client/links/loggerLink
    //  - https://trpc.io/docs/server/error-handling#handling-errors
    void tg.log("🔴 onError", error.name, error.message, error.cause?.stack)
  },
})
