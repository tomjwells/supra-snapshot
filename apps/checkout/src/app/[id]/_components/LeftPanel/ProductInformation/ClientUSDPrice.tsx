"use client"

import { useFormContext } from "react-hook-form"
import type z from "zod"

import type { ProductType } from "~/_backend/products"
import type { checkoutFormSchema } from "~/app/[id]/_providers/CheckoutFormProvider"

export default function ClientUSDPrice({ product }: { product: NonNullable<ProductType> }) {
  const form = useFormContext<z.infer<typeof checkoutFormSchema>>()

  return product?.price
    ? (
        (form.watch("item_quantity") ?? product.quantity_minimum) *
        parseFloat(product?.price.toString()) *
        parseFloat(product?.currency.lastPriceUSD.toString())
      ).toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
      })
    : "$-.--"
}
