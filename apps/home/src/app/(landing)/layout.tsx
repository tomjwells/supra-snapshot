import React, { Suspense } from "react"
import type { Metadata } from "next"
import { HogProvider, PostHogPageview } from "@acme/analytics/posthog"

import Footer from "./_layoutComponents/Footer"
import Header from "./_layoutComponents/Header/Header"
import HeaderProvider from "./_layoutComponents/Header/HeaderProvider"
import { NextThemesProvider } from "./NextThemesProvider"

import "@styles/globals.css"

import { Toaster } from "@acme/shadcn/sonner"
import { Theme, ThemePanel } from "@radix-ui/themes"

// @ts-ignore cjs
import { env } from "~/env.ts"

export const runtime = "edge"

export const metadata: Metadata = {
  title: "Supra",
  description: "Supra Payments - A no-code payment processor for Cardano. Accept ADA, DJED, SHEN and more for physical and digital products.",
  keywords: ["payments", "ecommerce", "e-commerce", "no-code", "shopify", "woocommerce", "stripe", "cardano", "ada", "djed", "shen"],
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

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {env.NEXT_PUBLIC_NODE_ENV === "production" && (
        <Suspense>
          <script async src="/u" data-website-id={env.UMAMI_HOME} />
          <PostHogPageview />
        </Suspense>
      )}
      <body
        className={[
          "font-sans",
        ].join(" ")}
      >
        <HogProvider>
          <NextThemesProvider>
            <Theme>
              <span className="subpixel-antialiased">
                <span className="flex min-h-screen flex-col justify-between pt-[var(--navigation-height)]">
                  <HeaderProvider>
                    <Suspense>
                      <Header />
                    </Suspense>
                  </HeaderProvider>
                  {props.children}
                  <Suspense>
                    <Footer />
                  </Suspense>
                </span>
                {process.env.NODE_ENV === "development" && <ThemePanel defaultOpen={false} />}
              </span>
            </Theme>
            <Toaster />
          </NextThemesProvider>
        </HogProvider>
      </body>
    </html>
  )
}
