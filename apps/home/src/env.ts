import { env as analyticsEnv } from "@acme/analytics/env";
import { env as authEnv } from "@acme/auth/env";
import { env as dbEnv } from "@acme/db-drizzle/env";
import { env as emailEnv } from "@acme/email/env";
import { createEnv } from "@t3-oss/env-nextjs";
import { vercel } from "@t3-oss/env-nextjs/presets";
import { z } from "zod";





export const env = createEnv({
  extends: [vercel(), analyticsEnv, authEnv, emailEnv, dbEnv],
  shared: {
    VERCEL_URL: z
      .string()
      .optional()
      .transform((v) => (v ? `https://${v}` : undefined)),
    PORT: z.coerce.number().default(3001),
    NODE_ENV: z.enum(["development", "production"]),
  },
  server: {
    UMAMI_HOME: z.string().uuid(),
  },
  client: {
    NEXT_PUBLIC_NODE_ENV: z.enum(["development", "test", "production"]),
    NEXT_PUBLIC_BASE_URL: z.string().url(),
    NEXT_PUBLIC_CHECKOUT_URL: z.string().url(),
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_SUPRA_FEE_RATE: z.coerce.number().min(0).max(1),
  },
  experimental__runtimeEnv: {
    VERCEL_URL: process.env.VERCEL_URL,
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : `https://${process.env.DEVTUNNEL_ID}-3000.uks1.devtunnels.ms/`,
    NEXT_PUBLIC_CHECKOUT_URL: process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://checkout.suprapayments.io`
      : `https://${process.env.DEVTUNNEL_ID}-3002.uks1.devtunnels.ms/`,
    NEXT_PUBLIC_SUPRA_FEE_RATE: process.env.NEXT_PUBLIC_SUPRA_FEE_RATE,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_VERCEL_URL ? `https://app.suprapayments.io` : `https://${process.env.DEVTUNNEL_ID}-3001.uks1.devtunnels.ms/`,
  },
})