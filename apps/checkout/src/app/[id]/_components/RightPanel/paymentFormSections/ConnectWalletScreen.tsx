"use client"

import React from "react"
import { CardanoWallet, useNetwork, useWallet } from "@meshsdk/react"
import { toast } from "sonner"

import type { ProductType } from "~/_backend/products"
import CurrencySelection from "./CurrencySelection"

export default function ConnectWalletScreen({
  product,
  setScreen,
  nextScreen,
  selectedCurrency,
}: {
  product: NonNullable<ProductType>
  setScreen: React.Dispatch<React.SetStateAction<string>>
  nextScreen: string
  selectedCurrency: NonNullable<ProductType>["acceptedCurrencies"][number]
}) {
  const { wallet, connected, name, connecting, connect, disconnect, error } = useWallet()

  const network = useNetwork()

  React.useEffect(() => {
    if (typeof network === "number") {
      if ((product.Environment.network === "testnet" && network === 0) || (product.Environment.network === "mainnet" && network === 1)) {
        console.log("network is correct")
        if (connected) {
          setScreen(nextScreen)
        }
      } else {
        if (connected) {
          toast.info(`Please make sure your wallet is set up to use the ${product.Environment.network} network to connect with this checkout page.`)
          // "Please connect a wallet on the same network as the product."
          // This product is on the {environment.network} network. Please make sure you are connecting with a {environment.network} wallet.
          disconnect()
          setScreen("connect-wallet")
        }
      }
    }
  }, [connected, network, product.Environment.network, disconnect, setScreen, nextScreen])

  return (
    <section
      aria-labelledby="payment-details-heading"
      className="flex h-full flex-col  items-center justify-center gap-y-6 px-8 lg:col-start-2  lg:row-start-1 lg:mx-auto lg:h-screen lg:w-full lg:max-w-lg  lg:px-8 "
    >
      <span className="theme-dark z-10 rounded-md border text-gray-11">
        <CardanoWallet />
      </span>
      <CurrencySelection selectedCurrency={selectedCurrency} product={product} paymentState="pay" />
    </section>
  )
}
