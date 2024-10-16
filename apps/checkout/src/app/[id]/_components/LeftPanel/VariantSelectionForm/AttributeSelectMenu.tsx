"use client"

import React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Flex, Select, Text } from "@radix-ui/themes"
import { useFormContext } from "react-hook-form"
import type z from "zod"

import type { CheckoutLinkType } from "~/_backend/checkoutLinks"
import type { ProductType } from "~/_backend/products"
import type { checkoutFormSchema } from "~/app/[id]/_providers/CheckoutFormProvider"

export function AttributeSelectMenu({
  checkoutLink,
  attribute,
  product,
  selectableVariants,
}: {
  checkoutLink: CheckoutLinkType
  attribute: NonNullable<CheckoutLinkType["collection"]>["attributes"][number]
  product: NonNullable<ProductType>
  selectableVariants: NonNullable<CheckoutLinkType["collection"]>["variants"]
}) {
  const router = useRouter()
  const params = useSearchParams()

  const widthClass = "!w-[300px]"
  const form = useFormContext<z.infer<typeof checkoutFormSchema>>()

  const selectedAttributeOptionIdsExcludingThisAttribute =
    product.Variant?.attributeValues.filter((attributeValue) => attributeValue.attributeId !== attribute.id)?.map((attributeValue) => attributeValue.id) ?? []
  const selectableAttributeValueIds = selectableVariants.map((variant) => variant.attributeValues.map((attributeValue) => attributeValue.id))

  return (
    <Flex direction="column" gap="2">
      <Text size={{ initial: "1", sm: "2", md: "3" }} className="hyphens-auto whitespace-pre-line break-words font-[500] tracking-tight  text-white">
        {attribute.name}
      </Text>
      <Select.Root
        name={attribute.id}
        defaultValue={product.Variant?.attributeValues.find((attributeValue) => attributeValue.attributeId === attribute.id)?.id}
        disabled={form.watch("formState") !== "enabled"}
        size="3"
        onValueChange={(value) => {
          const selectedVariant = selectableVariants.find((variant) =>
            twoArraysHaveSameValues(
              variant.attributeValues.map((attributeValue) => attributeValue.id),
              [value, ...selectedAttributeOptionIdsExcludingThisAttribute],
            ),
          )
          router.push(
            `?${new URLSearchParams({
              ...Object.fromEntries(params ?? []),
              variant: selectedVariant?.id ?? "",
            }).toString()}`,
          )
        }}
      >
        <Select.Trigger className={widthClass} />
        <Select.Content className={widthClass}>
          <Select.Group>
            {attribute.values.length === 0 && (
              <Select.Item value="null" disabled>
                No options available
              </Select.Item>
            )}
            {attribute.values.map((value) => (
              <Select.Item
                key={value.id}
                value={value.id}
                disabled={
                  !selectableAttributeValueIds.some((selectableValueIds) =>
                    twoArraysHaveSameValues(selectableValueIds, [value.id, ...selectedAttributeOptionIdsExcludingThisAttribute]),
                  )
                }
              >
                {value.value}{" "}
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>
    </Flex>
  )
}

function twoArraysHaveSameValues(array1: string[], array2: string[]) {
  return array1.length === array2.length && array1.every((value) => array2.includes(value))
}
