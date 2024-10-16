import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    RESEND_API_KEY: z.string(),
    BASE_URL: z.string().url(),
  },
  experimental__runtimeEnv: {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    BASE_URL: process.env.NODE_ENV === "production" ? `https://app.suprapayments.io` : `http://localhost:${process.env.PORT ?? 3001}`,
  },
})
