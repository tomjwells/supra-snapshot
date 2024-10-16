"use client"

import type { ReactNode } from "react"
import { addressSchema } from "@acme/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { z } from "zod"

import type { ProductType } from "~/_backend/products"

export const checkoutFormSchema = z.object({
  email: z.string().email(),
  currency: z.string().uuid(),
  formState: z.enum(["enabled", "disabled"]),
  item_quantity: z.number().int().min(1),
  ...addressSchema,
})

export default function CheckoutFormProvider({ children, product }: { children: ReactNode; product: NonNullable<ProductType> }) {
  const methods = useForm({
    mode: "onChange",
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      formState: "enabled",
      item_quantity: product.quantity_minimum || 1,
    },
  })

  return <FormProvider {...methods}>{children}</FormProvider>
}
