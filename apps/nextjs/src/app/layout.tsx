import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Theme, ThemePanel } from "@radix-ui/themes"

import "~/styles/globals.css"

import { Suspense } from "react"
import { HogProvider, PostHogPageview } from "@acme/analytics/posthog"
import { Toaster } from "@acme/shadcn/sonner"

// @ts-expect-error cjs
import { env } from "~/env.ts"
import NextThemesProvider from "./_providers/nextThemesProvider"
import Providers from "./_providers/providers"

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})
export const runtime = "edge"

export const metadata: Metadata = {
  title: "Supra",
  description: "Application dashboard for Merchants",
  openGraph: {
    title: "Supra",
    description: "Application dashboard for Merchants",
    url: "https://app.suprapayments.io",
    siteName: "Supra Payments",
  },
  icons: {
    icon: "/favicon.ico",
  },
  twitter: {
    card: "summary_large_image",
    site: "@tomjwells",
    creator: "@tomjwells",
  },
}

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" className="theme-light subpixel-antialiased" suppressHydrationWarning>
      {env.NEXT_PUBLIC_NODE_ENV === "production" && (
        <Suspense>
          <script async src="/u" data-website-id={env.UMAMI_APP} />
          <PostHogPageview />
        </Suspense>
      )}
      <body className={["font-sans", fontSans.variable].join(" ")}>
        <HogProvider>
          <NextThemesProvider>
            <Theme panelBackground="solid">
              <Providers>
                <Toaster position="top-center" richColors />

                {props.children}
              </Providers>
              {process.env.NODE_ENV === "development" && <ThemePanel defaultOpen={false} />}
            </Theme>
          </NextThemesProvider>
        </HogProvider>
      </body>
    </html>
  )
}
