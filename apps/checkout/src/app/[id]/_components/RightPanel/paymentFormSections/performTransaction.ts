import type { BrowserWallet } from "@meshsdk/core"
import type { FieldValues, UseFormGetValues } from "react-hook-form"

import type { ProductType } from "~/_backend/products"
import { proxyClient } from "~/_trpc/pages-api"
import { logger } from "~/utils/logger"

export default async function performTransaction(
  clientWallet: BrowserWallet,
  getValues: UseFormGetValues<FieldValues>,
  productId: string,
  selectedCurrency: NonNullable<ProductType>["acceptedCurrencies"][number],
) {
  logger.log("creating transaction", {
    recipientAddress: await clientWallet.getChangeAddress(),
    utxos: await clientWallet.getUtxos(), 
    email: getValues("email") as string,
  })
  const { unsignedTx } = await proxyClient.payments.create.mutate({
    checkoutLinkId: getIdFromUrl(window.location.href),
    productId,
    recipientAddress: (await clientWallet.getChangeAddress()) as string,
    utxos: await clientWallet.getUtxos(),
    email: getValues("email") as string,
    currencyId: selectedCurrency.id,
    collect_custom_information: getValues("collect_custom_information"),
    address:
      getValues("firstName") && getValues("addressLine1") && getValues("ZipOrPostcode")
        ? {
            firstName: getValues("firstName") as string,
            lastName: getValues("lastName") as string,
            addressLine1: getValues("addressLine1") as string,
            addressLine2: getValues("addressLine2") as string,
            city: getValues("city") as string,
            StateProvinceCounty: getValues("StateProvinceCounty") as string,
            ZipOrPostcode: getValues("ZipOrPostcode") as string,
            country: getValues("country") as string,
          }
        : undefined,
    item_quantity: getValues("item_quantity"),
  })

  console.log({ unsignedTx })
  if (typeof unsignedTx !== "string" || !(unsignedTx.length > 5)) {
    throw new Error("Unhandled error")
  }

  // 3) Partially Sign transaction
  const signedTx = await clientWallet.signTx(unsignedTx, true)

  // 4) Update payment record
  const updatedPayment = await proxyClient.payments.confirmTransaction.mutate({
    signedTx,
  })
  if (typeof updatedPayment === "undefined") {
    throw new Error("confirmTransaction error")
  }
  return updatedPayment
}

function getIdFromUrl(url: string) {
  const parsedUrl = new URL(url)
  const pathname = parsedUrl.pathname
  const id = pathname.slice(1)
  return id
}
