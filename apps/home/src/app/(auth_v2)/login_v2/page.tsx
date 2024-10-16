import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { SupraImageLogoSVG } from "@acme/ui/Brand/SupraLogo"

// @ts-expect-error cjs
import { env } from "~/env.ts"
import Button from "../_components/button"
import LoginForm from "./form"

export const metadata: Metadata = {
  title: "Sign In",
  description: "Supra Payments - A no-code payment processor for Cardano. Accept ADA, DJED, SHEN and more for physical and digital products.",
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

export default function LoginPage() {
  return (
    <div className="relative z-10    h-fit w-full max-w-md overflow-hidden border border-gray-100 sm:rounded-2xl sm:shadow-xl">
      <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
        <SupraImageLogoSVG height={37} width={37} />
        <h3 className="text-xl font-semibold">Sign In</h3>

        <p className="text-sm text-gray-500">Start creating checkout links for your items</p>
      </div>
      <Suspense
        fallback={
          <div className="flex flex-col space-y-3 bg-gray-50 px-4 py-8 sm:px-16">
            <Button disabled={true} text="" variant="secondary" />
            <Button disabled={true} text="" variant="secondary" />
            <Button disabled={true} text="" variant="secondary" />
            <div className="mx-auto h-5 w-3/4 rounded-lg bg-gray-100" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  )
}
