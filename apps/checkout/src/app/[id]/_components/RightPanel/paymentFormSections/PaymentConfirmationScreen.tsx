import React from "react"

import { type RouterOutputs } from "~/_trpc/api"

export default function PaymentConfirmationScreen({ checkoutLink }: { checkoutLink: CheckoutLink }) {
  const [countdown, setCountdown] = React.useState(7)

  React.useEffect(() => {
    if (checkoutLink.redirect && checkoutLink.redirectUrl) {
      const intervalId = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1)
      }, 1000)

      return () => clearInterval(intervalId)
    }
  }, [])

  React.useEffect(() => {
    if (countdown === 0 && checkoutLink.redirectUrl) {
      window.location.href = checkoutLink.redirectUrl
    }
  }, [countdown, checkoutLink.redirectUrl])

  return (
    <section
      aria-labelledby="payment-and-shipping-heading"
      className="flex h-full flex-col items-center  justify-center px-8 lg:col-start-2  lg:row-start-1 lg:mx-auto lg:h-screen lg:w-full lg:max-w-lg  lg:px-8 "
    >
      <ThankyouConfirmationScreen redirect={checkoutLink.redirect} countdown={countdown} />
    </section>
  )
}

function ThankyouConfirmationScreen({ redirect, countdown }: { redirect: boolean; countdown: number }) {
  return (
    <div className="flex max-w-sm flex-col justify-center align-middle">
      <h1 className="text-3xl font-bold tracking-tight text-slate-12">Thank you</h1>

      <p className="mt-2 text-sm text-slate-10">Your payment was submitted successfully.</p>
      {redirect && <p className="mt-4 text-center text-sm text-gray-400 ">Redirecting you in {countdown}...</p>}
    </div>
  )
}
