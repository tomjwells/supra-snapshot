import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    SUPRA_FEE_RATE: z.coerce.number().min(0).max(1),
    SUPRA_CARDANO_WALLET_ADDRESS_MAINNET: z.string().startsWith("addr1"),
    SUPRA_CARDANO_WALLET_ADDRESS_TESTNET: z.string().startsWith("addr_test1"),
  },

  client: {
    NEXT_PUBLIC_NODE_ENV: z.enum(["development", "test", "production"]),
    NEXT_PUBLIC_BASE_URL: z.string().url(),
  },

  shared: {
    NODE_ENV: z.enum(["development", "production"]),
  },

  experimental__runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : `http://localhost:${process.env.PORT ?? 3001}`,
  },
})
