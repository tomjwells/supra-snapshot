import React from "react"
import { CircleImageIcon } from "@acme/ui/List/[id]/CircleImageIcon"
import { Flex, Heading, Text } from "@radix-ui/themes"

import type { ProductType } from "~/_backend/products"
import AmountDue from "../AmountDue"
import SubHeading from "../SubHeading"
import ClientUSDPrice from "./ClientUSDPrice"
import ProductTextDescription from "./ProductTextDescription"

export default function ProductInformation({
  product,
  selectedCurrency,
}: {
  product: ProductType
  selectedCurrency: NonNullable<ProductType>["acceptedCurrencies"][number]
}) {
  if (!product) return null
  return (
    <div className="flex flex-1 flex-col gap-8">
      <Flex direction="row" gap={{ initial: "4", sm: "5", md: "6" }} mb="2">
        <CircleImageIcon image={product.image} alt={product.name ?? ""} style={"square"} size={20} fallbackIcon="CubeIcon" border={false} />
        <div className="flex w-full flex-col">
          <Flex direction="row">
            <Heading as="h1" size={{ initial: "2", md: "3" }} className="mr-2 flex-grow hyphens-auto break-words text-base font-medium text-white">
              {product.name}
            </Heading>

            <Text size={{ initial: "2", md: "3" }} as="span" weight="regular" className="text-base" style={{ color: "#b8bcc3" }}>
              <ClientUSDPrice product={product} />
            </Text>
          </Flex>
          <Flex direction="column" className="mt-2">
            <SubHeading>Description</SubHeading>
            <ProductTextDescription product={product} />
          </Flex>
        </div>
      </Flex>
      <AmountDue product={product} selectedCurrency={selectedCurrency} />
    </div>
  )
}
