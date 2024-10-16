import "@styles/globals.css"
import "@radix-ui/themes/styles.css"
import "@acme/ui/styles/radixui-theme-config.css"

import { Suspense } from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { PostHogPageview } from "@acme/analytics/posthog"
import { auth } from "@acme/auth"
import { Toaster } from "@acme/shadcn/sonner"
import { Theme, ThemePanel } from "@radix-ui/themes"

// @ts-expect-error cjs
import { env } from "~/env.ts"
import { NextThemesProvider } from "../(landing)/NextThemesProvider"
import Providers from "./providers"

export const runtime = "edge"
// export const runtime = "nodejs"

export const metadata: Metadata = {
  title: "Supra",
  description: "Simplify and automate your billing operations on Cardano, so you can focus on growth.",
  icons: {
    icon: "https://suprapayments.io/favicon.png",
  },
  twitter: {
    card: "summary_large_image",
    site: "@tomjwells",
    creator: "@tomjwells",
    images: ["https://suprapayments.io/og.png"],
    description: "Simplify and automate your billing operations on Cardano, so you can focus on growth.",
  },
  openGraph: {
    title: "Supra",
    description: "Simplify and automate your billing operations on Cardano, so you can focus on growth.",
    url: "https://suprapayments.io",
    siteName: "Supra Payments",
    images: [
      {
        url: "https://suprapayments.io/og.png",
        width: 2962,
        height: 1800,
        alt: "Supra Payments",
      },
    ],
  },
}

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  if (await auth()) redirect(env.NEXT_PUBLIC_APP_URL)
  return (
    <html lang="en" className="subpixel-antialiased">
      <script async src="/u" data-website-id={env.UMAMI_HOME} />
      <Suspense>
        <PostHogPageview />
      </Suspense>
      <body>
        <Providers>
          <NextThemesProvider defaultTheme="dark">
            <Theme>
              <div className="flex min-h-screen flex-col bg-[hsl(240deg_5.56%_7%)]">{children}</div>
              {process.env.NODE_ENV === "development" && <ThemePanel defaultOpen={false} />}
              <Toaster position="top-center" richColors />
            </Theme>
          </NextThemesProvider>
        </Providers>
      </body>
    </html>
  )
}
