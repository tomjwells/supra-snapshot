import { env } from "~/env.ts"

export const getBaseUrl = () => {
  if (typeof window !== "undefined") return "" // browser should use relative url
  if (env.VERCEL_URL) return env.VERCEL_URL // SSR should use vercel url

  return `http://localhost:${env.PORT}` // dev SSR should use localhost
}
