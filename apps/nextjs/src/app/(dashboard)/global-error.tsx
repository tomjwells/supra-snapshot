"use client"

import GlobalError from "@acme/ui/Brand/GlobalError"

// @ts-expect-error cjs
import { env } from "~/env.ts"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  // The global-error.tsx is different from the error.tsx in that it is not wrapped in a <html> tag.
  // https://nextjs.org/docs/app/api-reference/file-conventions/error#global-errorjs
  return (
    <html lang="en">
      <body className="min-h-screen">
        <GlobalError projectUrl={env.NEXT_PUBLIC_BASE_URL} error={error} reset={reset} />
      </body>
    </html>
  )
}
