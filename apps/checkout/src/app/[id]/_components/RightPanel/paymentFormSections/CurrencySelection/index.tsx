import React, { Suspense } from "react"

import type { ProductType } from "~/_backend/products"
import ComboboxForm from "./ShadCn"

export default function CurrencySelection({
  product,
  paymentState,
  selectedCurrency,
}: {
  product: NonNullable<ProductType>
  paymentState: "pay" | "loading"
  selectedCurrency: NonNullable<ProductType>["acceptedCurrencies"][number]
}) {
  return (
    <div className="w-[200px] pt-4">
      <Suspense>
        <ComboboxForm product={product} paymentState={paymentState} selectedCurrency={selectedCurrency} />
      </Suspense>
    </div>
  )
}
