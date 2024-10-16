"use client"

import React from "react"
import { FormControl, FormField, FormItem, FormLabel } from "@acme/shadcn/form"
import { Input } from "@acme/ui/Forms/Input"
import { Flex, Text } from "@radix-ui/themes"
import { useFormContext } from "react-hook-form"
import type z from "zod"

import type { ProductType } from "~/_backend/products"
import type { checkoutFormSchema } from "~/app/[id]/_providers/CheckoutFormProvider"

export default function VariableQuantityForm({ product }: { product: ProductType }) {
  if (!product || !product.quantity_variable) return null
  return <QuantityField product={product} />
}
function QuantityField({ product }: { product: NonNullable<ProductType> }) {
  const form = useFormContext<z.infer<typeof checkoutFormSchema>>()

  return (
    <FormField
      control={form.control}
      name="item_quantity"
      defaultValue={product.quantity_minimum}
      rules={{
        required: true,
        min: product.quantity_minimum,
        max: product.quantity_maximum,
      }}
      render={({ field }) => (
        <FormItem>
          <Flex direction="column" gap="2">
            <FormLabel>
              <Text size={{ initial: "1", sm: "2", md: "3" }} className="hyphens-auto whitespace-pre-line break-words font-[500] tracking-tight  text-white">
                Quantity
              </Text>
            </FormLabel>
            <dd className="mt-1 w-24 text-sm leading-6 text-gray-11 sm:col-span-1 sm:mt-0">
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  size="3"
                  min={product.quantity_minimum}
                  max={product.quantity_maximum}
                  disabled={form.watch("formState") !== "enabled"}
                  onChange={(event) => {
                    let value = parseInt(event.target.value)
                    if (value > product.quantity_maximum) value = product.quantity_maximum
                    if (value < product.quantity_minimum) value = product.quantity_minimum
                    console.log(value)
                    field.onChange(value)
                  }}
                />
              </FormControl>
            </dd>
          </Flex>
        </FormItem>
      )}
    />
  )
}
