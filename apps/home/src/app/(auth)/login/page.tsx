import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { SupraImageLogoSVG } from "@acme/ui/Brand/SupraLogo"
import { REGISTER_URL } from "@data/constants"

// @ts-expect-error cjs
import { env } from "~/env.ts"
import Button from "../_components/button"
import NavBar from "../_components/NavBar"
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
    <>
      <NavBar mode="login" />
      <div className="flex flex-grow items-center justify-center">
        <div className="relative z-10 h-fit    w-full max-w-md  overflow-hidden  sm:rounded-2xl ">
          <div className="flex flex-col items-center justify-center space-y-3 px-4 py-6 pt-8 text-center sm:px-16">
            <h1 className="text-4xl font-semibold text-white">Log in to Supra</h1>
          </div>
          <Suspense
            fallback={
              <div className="flex flex-col space-y-3 px-4 py-8 sm:px-16">
                <Button disabled={true} text="" variant="secondary" />
                <Button disabled={true} text="" variant="secondary" />
                <Button disabled={true} text="" variant="secondary" />
                <div className="mx-auto h-5 w-3/4 rounded-lg" />
              </div>
            }
          >
            <LoginForm />
          </Suspense>
        </div>
      </div>
      <Footer />
    </>
  )
}

function Footer() {
  return (
    <footer className="flex h-28 items-center justify-center bg-black">
      <p className="text-center  text-gray-200">
        Don't have an account?&nbsp;&nbsp;&nbsp;
        <Link href={REGISTER_URL} className="font-semibold text-gray-200 transition-colors hover:text-white">
          Sign up
        </Link>
      </p>
    </footer>
  )
}
