"use client"

import GlobalError from "@acme/ui/Brand/GlobalError"

import { env } from "../env.ts"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <GlobalError projectUrl={env.NEXT_PUBLIC_BASE_URL} error={error} reset={reset} />
}
