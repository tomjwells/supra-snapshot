import { paymentsRouter } from "./router/payments"
import { createTRPCRouter } from "./trpc"

export const appRouter = createTRPCRouter({
  payments: paymentsRouter,
})

export type AppRouter = typeof appRouter
