"use client"

import React from "react"
import LoadingSpinner2 from "@acme/ui/loadingSpinner2"
import { useWallet } from "@meshsdk/react"
import { useFormContext } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

import type { ProductType } from "~/_backend/products"
import { proxyClient } from "~/_trpc/pages-api"
import { checkoutFormSchema } from "~/app/[id]/_providers/CheckoutFormProvider"
import CurrencySelection from "./CurrencySelection/index"
import performTransaction from "./performTransaction"

export function isErrorWithMessage(e: unknown): e is { message: string } {
  return typeof e === "object" && e !== null && "message" in e && typeof (e as { message: string }).message === "string"
}

export default function ConfirmPaymentScreen({
  product,
  setScreen,
  selectedCurrency,
}: {
  product: NonNullable<ProductType>
  setScreen: React.Dispatch<React.SetStateAction<string>>
  selectedCurrency: NonNullable<ProductType>["acceptedCurrencies"][number]
}) {
  const form = useFormContext<z.infer<typeof checkoutFormSchema>>()

  const [paymentState, setPaymentState] = React.useState<"pay" | "loading">("pay")
  const { wallet, connected, name, connecting, connect, disconnect, error } = useWallet()

  return (
    <section
      aria-labelledby="payment-and-shipping-heading"
      className="mx-auto flex h-full w-full max-w-2xl flex-col items-center justify-center gap-y-6 px-8  lg:h-screen "
    >
      <button
        type="button"
        className="flex w-full max-w-md items-center justify-center  rounded-md border border-transparent bg-slate-12 py-2 text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
        disabled={form.watch("formState") !== "enabled"}
        onClick={async (e) => {
          e.preventDefault()
          setPaymentState("loading")
          form.setValue("formState", "disabled")
          await performTransaction(wallet, form.getValues, product.id, selectedCurrency)
            .then(() => {
              setScreen("payment-confirmation")
            })
            .catch(async (e) => {
              console.error(e)
              console.log("isErrorWithMessage(e)", isErrorWithMessage(e))
              console.log("e.message", e.message)
              if (isErrorWithMessage(e) && e.message.includes("Error creating transaction: Insufficient ada.")) {
                console.log("Insufficient funds in customer's wallet: ", e.message)
                toast.info("Could not create the transaction. Please check if there is enough funds in your wallet.")
              } else if (isErrorWithMessage(e) && e.message.includes("Error creating transaction: Insufficient native token.")) {
                console.log("Insufficient native token in customer's wallet: ", e.message)
                toast.info(`Could not create the transaction. Please check if there is enough ${selectedCurrency?.ticker} in your wallet.`)
                if (true) {
                  disconnect()
                  await connect(name)
                }
              } else if (isErrorWithMessage(e) && e.message.includes("out of stock")) {
                console.log("Out of stock error: ", e.message)
                toast.info("Insufficient stock available.")
              } else if (isErrorWithMessage(e) && e.message.includes("invalid checksum")) {
                console.log("invalid checksum error: ", e.message)
                toast.info("Invalid checksum for the transaction")
              } else if (isErrorWithMessage(e) && e.message.includes("user declined tx")) {
                // This means the user declined the tx 
                void proxyClient.payments.logging.mutate({ message: "This is okay " + JSON.stringify(e.message) })
              } else if (isErrorWithMessage(e) && e.message.includes("user declined sign tx")) {
                // Similar to above but slight variation
                void proxyClient.payments.logging.mutate({ message: "This is okay " + JSON.stringify(e.message) })
              } else if (isErrorWithMessage(e) && e.message.includes("confirmTransaction error")) {
                toast.info("An error occurred while confirming the transaction. The team has been notified and will fix the problem shortly.")
              } else if (isErrorWithMessage(e) && (e.message.includes("refused due to lack of access") || e.message.includes("declined to sign"))) {
                // This is when the user disconnects a wallet
                console.log("Wallet disconnect: ", e.message)
              } else {
                console.log("Unhandled error: ", e.message)
                toast.info("Something went wrong on the server. Please try again later - The team has been notified and will fix the problem shortly.")
                void proxyClient.payments.logging.mutate({ message: JSON.stringify(e.message) })
              }
              setPaymentState("pay")
              form.setValue("formState", "enabled")
            })
        }}
      >
        {paymentState === "loading" ? (
          <LoadingSpinner2 color="white" />
        ) : (
          <>
            <img
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzNzUgMzQ2LjUxIj48ZyBpZD0iTGF5ZXJfMiIgZGF0YS1uYW1lPSJMYXllciAyIj48ZyBpZD0iTGF5ZXJfMS0yIiBkYXRhLW5hbWU9IkxheWVyIDEiPjxwYXRoIGQ9Ik0xMDIuNzYsMTcyYTI1LjMxLDI1LjMxLDAsMCwwLDIzLjc4LDI2LjY1Yy40OSwwLDEsMCwxLjQ2LDBBMjUuMjYsMjUuMjYsMCwxLDAsMTAyLjc2LDE3MloiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNOC42MiwxNjUuNWE4LjE2LDguMTYsMCwxLDAsNy42OSw4LjYxQTguMTUsOC4xNSwwLDAsMCw4LjYyLDE2NS41WiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0xMDEuMTYsMjUuNDNhOC4xNiw4LjE2LDAsMSwwLTExLTMuNjJBOC4xOCw4LjE4LDAsMCwwLDEwMS4xNiwyNS40M1oiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNMTI2Ljc4LDcwLjFhMTIuNjEsMTIuNjEsMCwxLDAtMTYuOTQtNS41OUExMi42MiwxMi42MiwwLDAsMCwxMjYuNzgsNzAuMVoiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNNDAuNTgsMTAwLjgyYTEwLjM5LDEwLjM5LDAsMSwwLTMtMTQuMzhBMTAuMzksMTAuMzksMCwwLDAsNDAuNTgsMTAwLjgyWiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik01NS45MywxNjFhMTIuNjIsMTIuNjIsMCwxLDAsMTEuODgsMTMuMzFBMTIuNjIsMTIuNjIsMCwwLDAsNTUuOTMsMTYxWiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik00MiwyNDUuNzJhMTAuMzksMTAuMzksMCwxLDAsMTMuOTUsNC42QTEwLjM3LDEwLjM3LDAsMCwwLDQyLDI0NS43MloiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNOTEsMTM0Ljg5YTE0Ljg0LDE0Ljg0LDAsMSwwLTQuMjctMjAuNTVBMTQuODMsMTQuODMsMCwwLDAsOTEsMTM0Ljg5WiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0yNDYuNDcsNjkuMWExMi42MiwxMi42MiwwLDEsMC0zLjYzLTE3LjQ3QTEyLjYxLDEyLjYxLDAsMCwwLDI0Ni40Nyw2OS4xWiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0yNzIuMzUsMjQuNTdBOC4xNiw4LjE2LDAsMSwwLDI3MCwxMy4yNiw4LjE2LDguMTYsMCwwLDAsMjcyLjM1LDI0LjU3WiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0yNDguNDUsMTQ3LjkxYTI1LjI1LDI1LjI1LDAsMCwwLTIuODcsNTAuNDJjLjQ5LDAsMSwwLDEuNDUsMGEyNS4yNSwyNS4yNSwwLDAsMCwxLjQyLTUwLjQ2WiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0xMzUuMDgsMTMzLjE0QTI1LjEyLDI1LjEyLDAsMCwwLDE1Ny42NCwxNDdhMjUuMjUsMjUuMjUsMCwwLDAsMjIuNTQtMzYuNjIsMjUuMjUsMjUuMjUsMCwxLDAtNDUuMSwyMi43M1oiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNMzMzLDEwMC43OWExMC4zOSwxMC4zOSwwLDEsMC0xNC00LjZBMTAuNCwxMC40LDAsMCwwLDMzMywxMDAuNzlaIiBmaWxsPSIjZmZmIi8+PHBhdGggZD0iTTI2OSwxMDguODNhMTQuODQsMTQuODQsMCwxLDAsMTkuOTQsNi41OEExNC44NiwxNC44NiwwLDAsMCwyNjksMTA4LjgzWiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0xODYuNTUsMjAuNzZhMTAuMzksMTAuMzksMCwxLDAtOS43OS0xMUExMC4zOCwxMC4zOCwwLDAsMCwxODYuNTUsMjAuNzZaIiBmaWxsPSIjZmZmIi8+PHBhdGggZD0iTTE4Ni40Myw4Ni4xM2ExNC44NCwxNC44NCwwLDEsMC0xNC0xNS42NkExNC44NCwxNC44NCwwLDAsMCwxODYuNDMsODYuMTNaIiBmaWxsPSIjZmZmIi8+PHBhdGggZD0iTTEwNiwyMzcuNjhhMTQuODQsMTQuODQsMCwxLDAtMTkuOTMtNi41OEExNC44NSwxNC44NSwwLDAsMCwxMDYsMjM3LjY4WiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0xOTYsMTA3Ljc5YTI1LjIyLDI1LjIyLDAsMSwwLDIxLjE0LTExLjQxQTI1LjI4LDI1LjI4LDAsMCwwLDE5NiwxMDcuNzlaIiBmaWxsPSIjZmZmIi8+PHBhdGggZD0iTTIzOS45MiwyMTMuMzdhMjUuMjYsMjUuMjYsMCwxLDAtMTEuMTgsMzMuOTFBMjUuMTEsMjUuMTEsMCwwLDAsMjM5LjkyLDIxMy4zN1oiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNMjg0LDIxMS42MmExNC44NCwxNC44NCwwLDEsMCw0LjI3LDIwLjU1QTE0Ljg0LDE0Ljg0LDAsMCwwLDI4NCwyMTEuNjJaIiBmaWxsPSIjZmZmIi8+PHBhdGggZD0iTTMzMi4zOCwxNzMuNjhhMTIuNjIsMTIuNjIsMCwxLDAtMTMuMzEsMTEuODhBMTIuNjIsMTIuNjIsMCwwLDAsMzMyLjM4LDE3My42OFoiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNMzY3LjMsMTY0LjcxYTguMTYsOC4xNiwwLDEsMCw3LjY5LDguNjFBOC4xNyw4LjE3LDAsMCwwLDM2Ny4zLDE2NC43MVoiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNMzM0LjQyLDI0NS42OGExMC4zOSwxMC4zOSwwLDEsMCwzLDE0LjM5QTEwLjM5LDEwLjM5LDAsMCwwLDMzNC40MiwyNDUuNjhaIiBmaWxsPSIjZmZmIi8+PHBhdGggZD0iTTEwMi42NSwzMjEuOTRhOC4xNiw4LjE2LDAsMSwwLDIuMzQsMTEuM0E4LjE3LDguMTcsMCwwLDAsMTAyLjY1LDMyMS45NFoiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNMjczLjgzLDMyMS4wOGE4LjE2LDguMTYsMCwxLDAsMTEsMy42MkE4LjE2LDguMTYsMCwwLDAsMjczLjgzLDMyMS4wOFoiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNMTc5LDIzOC43MWEyNS4yNSwyNS4yNSwwLDEsMC0yMS4xNCwxMS40MUEyNS4xLDI1LjEsMCwwLDAsMTc5LDIzOC43MVoiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNMTI4LjUzLDI3Ny40MWExMi42MiwxMi42MiwwLDEsMCwzLjYzLDE3LjQ3QTEyLjYyLDEyLjYyLDAsMCwwLDEyOC41MywyNzcuNDFaIiBmaWxsPSIjZmZmIi8+PHBhdGggZD0iTTE4Ny4zOCwzMjUuNzRhMTAuMzksMTAuMzksMCwxLDAsOS43OCwxMUExMC4zOSwxMC4zOSwwLDAsMCwxODcuMzgsMzI1Ljc0WiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0xODcuNDksMjYwLjM3YTE0Ljg0LDE0Ljg0LDAsMSwwLDE0LDE1LjY3QTE0Ljg1LDE0Ljg1LDAsMCwwLDE4Ny40OSwyNjAuMzdaIiBmaWxsPSIjZmZmIi8+PHBhdGggZD0iTTI0OC4yMSwyNzYuNGExMi42MiwxMi42MiwwLDEsMCwxNyw1LjU5QTEyLjYyLDEyLjYyLDAsMCwwLDI0OC4yMSwyNzYuNFoiIGZpbGw9IiNmZmYiLz48L2c+PC9nPjwvc3ZnPg=="
              className="mr-[4px] h-[20px] w-auto "
              alt="Cardano"
            />
            <span
              className="text-[1.3rem] leading-none tracking-wide"
              style={{
                fontWeight: 450,
                transform: "translateY(-1px)",
                fontFamily:
                  '-apple-system, "system-ui", "Segoe UI (Custom)", Roboto, "Helvetica Neue", "Open Sans (Custom)", system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
              }}
            >
              Pay with {selectedCurrency.ticker}
            </span>
          </>
        )}
      </button>
      <span className="flex w-full justify-center">
        <CurrencySelection selectedCurrency={selectedCurrency} product={product} paymentState={paymentState} />
      </span>
    </section>
  )
}
