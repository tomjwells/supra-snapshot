import { Suspense } from "react"
import type { Metadata } from "next"

import Button from "../_components/button"
import NavBar from "../_components/NavBar"
import RegisterForm from "./form"

export const metadata: Metadata = {
  title: "Create an account",
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

export default function RegisterPage() {
  return (
    <>
      <NavBar mode="signup" />
      <div className="flex flex-grow items-center justify-center">
        <div className="relative z-10 h-fit w-full max-w-md  overflow-hidden  sm:rounded-2xl ">
          <div className="flex flex-col items-center justify-center space-y-3 px-4 py-6 pt-8 text-center sm:px-16">
            <h1 className="text-4xl font-semibold text-white">Create Your Supra Account</h1>
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
            <RegisterForm />
          </Suspense>
        </div>
      </div>
    </>
  )
}
