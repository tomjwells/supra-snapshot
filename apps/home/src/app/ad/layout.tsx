import React, { Suspense } from "react"
import type { Metadata } from "next"


import { NextThemesProvider } from "../(landing)/NextThemesProvider"

import "@styles/globals.css"

import { Theme, ThemePanel } from "@radix-ui/themes"


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
      <body
        className={[
          "font-sans",
          // fontSans.variable
        ].join(" ")}
      >
        <NextThemesProvider>
          <Theme>
            <span className="subpixel-antialiased">
              <span className="flex min-h-screen flex-col justify-between">{props.children}</span>
              {process.env.NODE_ENV === "development" && <ThemePanel defaultOpen={false} />}
            </span>
          </Theme>
        </NextThemesProvider>
      </body>
    </html>
  )
}
