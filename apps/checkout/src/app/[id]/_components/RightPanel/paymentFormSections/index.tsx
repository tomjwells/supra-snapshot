"use client"

import React from "react"

import { CheckoutLinkType } from "~/_backend/checkoutLinks"
import { ProductType } from "~/_backend/products"
import AddressFormSection from "./AddressFormSection"
import ConfirmPaymentScreen from "./ConfirmPaymentScreen"
import ConnectWalletScreen from "./ConnectWalletScreen"
import CustomInformationSection from "./CustomInformationSection"
import EmailFormSection from "./EmailFormSection"
import PaymentConfirmationScreen from "./PaymentConfirmationScreen"

export default function MultiScreenCheckoutForm({
  product,
  checkoutLink,
  selectedCurrency,
}: {
  product: NonNullable<ProductType>
  checkoutLink: CheckoutLinkType
  selectedCurrency: NonNullable<ProductType>["acceptedCurrencies"][number]
}) {
  const [screen, setScreen] = React.useState("connect-wallet")

  return (
    <>
      {screen === "connect-wallet" && (
        <ConnectWalletScreen
          product={product}
          setScreen={setScreen}
          nextScreen={
            product.collect_custom_information.length > 0
              ? "custom-information"
              : product.collect_email
                ? "enter-email"
                : product.collect_address
                  ? "enter-address"
                  : "confirm-payment"
          }
          selectedCurrency={selectedCurrency}
        />
      )}
      {screen === "custom-information" && (
        <CustomInformationSection
          product={product}
          setScreen={setScreen}
          nextScreen={product.collect_email ? "enter-email" : product.collect_address ? "enter-address" : "confirm-payment"}
        />
      )}
      {screen === "enter-email" && <EmailFormSection setScreen={setScreen} nextScreen={product.collect_address ? "enter-address" : "confirm-payment"} />}
      {screen === "enter-address" && <AddressFormSection product={product} setScreen={setScreen} />}
      {screen === "confirm-payment" && <ConfirmPaymentScreen selectedCurrency={selectedCurrency} product={product} setScreen={setScreen} />}
      {screen === "payment-confirmation" && <PaymentConfirmationScreen checkoutLink={checkoutLink} />}
    </>
  )
}
