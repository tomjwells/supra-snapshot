import React, { Suspense } from "react"
import { Flex } from "@radix-ui/themes"

import type { CheckoutLinkType } from "~/_backend/checkoutLinks"
import type { ProductType } from "~/_backend/products"
import LowerSection from "./LowerSection"
import ProductInformation from "./ProductInformation/index"
import VariableQuantityForm from "./VariableQuantityForm"
import VariantSelectionForm from "./VariantSelectionForm"

export default function LeftPanel({
  checkoutLink,
  product,
  selectedCurrency,
}: {
  checkoutLink: CheckoutLinkType
  product: NonNullable<ProductType>
  selectedCurrency: NonNullable<ProductType>["acceptedCurrencies"][number]
}) {
  return (
    <Flex
      direction="column"
      justify="between"
      gap={{ initial: "4", sm: "5", md: "6" }}
      className="mx-auto h-full min-h-[50vh] max-w-5xl"
      p={{ initial: "7", sm: "8", md: "9" }}
    >
      <Suspense>
        <ProductInformation product={product} selectedCurrency={selectedCurrency} />
      </Suspense>
      <Suspense>
        <div className="flex flex-col gap-5">
          <VariantSelectionForm checkoutLink={checkoutLink} product={product} />
          <VariableQuantityForm product={product} />
        </div>
      </Suspense>
      <LowerSection checkoutLinkId={checkoutLink.id} product={product} />
    </Flex>
  )
}
