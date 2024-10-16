"use client"

import { cn } from "@acme/shadcn/utils/cn"
import { Flex } from "@radix-ui/themes"

import type { CheckoutLinkType } from "~/_backend/checkoutLinks"
import type { ProductType } from "~/_backend/products"
import MultiScreenCheckoutForm from "./paymentFormSections"

export default function RightPanel({
  product,
  checkoutLink,
  selectedCurrency,
}: {
  product: NonNullable<ProductType>
  checkoutLink: CheckoutLinkType
  selectedCurrency: NonNullable<ProductType>["acceptedCurrencies"][number]
}) {
  return (
    <Flex direction="column" justify="center" align="center" width="100%" className={cn("h-full min-h-[50vh]", " px-8 lg:mx-auto ")}>
      {product.inventory_track && product.inventory_quantity <= 0 && !product.inventory_continueSelling ? (
        <>
          <p className="text-center text-slate-10">This item is currently out of stock.</p>
          <p className="text-center text-slate-10">Please check back later, or check with the seller.</p>
          <p className="text-center text-slate-10">Thank you.</p>
        </>
      ) : (
        <MultiScreenCheckoutForm checkoutLink={checkoutLink} product={product} selectedCurrency={selectedCurrency} />
      )}
    </Flex>
  )
}
