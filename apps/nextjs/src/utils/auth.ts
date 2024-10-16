import { cache } from "react"
import { redirect } from "next/navigation"
// @ts-expect-error cjs
import { auth as authjs } from "@acme/auth"

// @ts-expect-error cjs
import { env } from "~/env.ts"

export const auth = cache(async () => {
  const session = await authjs()
  if (!session) redirect(env.NEXT_PUBLIC_HOMEPAGE_URL + "/login")
  return session
})
