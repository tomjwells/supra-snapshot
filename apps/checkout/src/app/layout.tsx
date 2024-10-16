import { Inter } from "next/font/google"
import { Theme, ThemePanel } from "@radix-ui/themes"

import "~/styles/globals.css"

import { Suspense } from "react"
import { PostHogPageview } from "@acme/analytics/posthog"
import { HogProvider } from "@acme/analytics/posthog/provider"
import { Toaster } from "@acme/shadcn/sonner"

// @ts-expect-error cjs
import { env } from "~/env.ts"

export const runtime = "edge"

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="theme-light subpixel-antialiased" suppressHydrationWarning>
      {env.NEXT_PUBLIC_NODE_ENV === "production" && (
        <Suspense>
          <script async src="https://suprapayments.io/u" data-website-id={env.UMAMI_CHECKOUT}></script>
          <PostHogPageview />
        </Suspense>
      )}
      <body className={["h-[100vh] font-sans", fontSans.variable].join(" ")}>
        <Suspense>
          <HogProvider>
            <Theme appearance="light" className="h-[100vh]">
              <Suspense>
                <Toaster position="top-center" richColors />
                {children}
              </Suspense>
              {env.NEXT_PUBLIC_NODE_ENV === "development" && <ThemePanel defaultOpen={false} />}
            </Theme>
          </HogProvider>
        </Suspense>
      </body>
    </html>
  )
}
