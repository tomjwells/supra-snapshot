import { env as analyticsEnv } from "@acme/analytics/env"
import { env as checkoutApiPagesEnv } from "@acme/checkout-api-pages/env"
import { env as cloudinaryEnv } from "@acme/cloudinary/env"
import { env as dbEnv } from "@acme/db/env"
import { createEnv } from "@t3-oss/env-nextjs"
import { vercel } from "@t3-oss/env-nextjs/presets"
import { z } from "zod"

export const env = createEnv({
  extends: [vercel(), analyticsEnv, checkoutApiPagesEnv, dbEnv, cloudinaryEnv],
  shared: {
    VERCEL_URL: z
      .string()
      .optional()
      .transform((v) => (v ? `https://${v}` : undefined)),
    PORT: z.coerce.number().default(3001),
  },
  server: {
    UMAMI_CHECKOUT: z.string().uuid(),
  },
  client: {
    NEXT_PUBLIC_NODE_ENV: z.enum(["development", "test", "production"]),
    NEXT_PUBLIC_BASE_URL: z.string().url(),
    NEXT_PUBLIC_HOMEPAGE_URL: z.string().url(),
  },
  experimental__runtimeEnv: {
    VERCEL_URL: process.env.VERCEL_URL,
    PORT: process.env.PORT,
    NEXT_PUBLIC_NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : `http://localhost:${process.env.PORT ?? 3001}`,
    NEXT_PUBLIC_HOMEPAGE_URL: (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : `http://localhost:${3000}`).includes(
      "localhost",
    )
      ? `http://localhost:3000`
      : `https://suprapayments.io`,
  },
  skipValidation: !!process.env.CI || !!process.env.SKIP_ENV_VALIDATION,
})
