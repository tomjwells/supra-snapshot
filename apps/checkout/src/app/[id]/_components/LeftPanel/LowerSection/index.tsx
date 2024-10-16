import { Suspense } from "react"
import { Network, prisma } from "@acme/db"
import { CircleImageIcon } from "@acme/ui/List/[id]/CircleImageIcon"
import { Flex, Heading } from "@radix-ui/themes"

import type { ProductType } from "~/_backend/products"
import TestnetBadge from "./TestnetBadge"

export default async function LowerSection({ checkoutLinkId, product }: { checkoutLinkId: string; product: NonNullable<ProductType> }) {
  const organization = await prisma.organization.findFirst({
    where: {
      Environment: {
        some: {
          OR: [
            { Product: { some: { CheckoutLink: { some: { id: checkoutLinkId } } } } },
            { Collection: { some: { CheckoutLink: { some: { id: checkoutLinkId } } } } },
          ],
        },
      },
    },
    select: { name: true, image: true },
  })
  if (!organization) return null
  return (
    <Flex className="flex-1" direction={{ initial: "row-reverse" }} align={{ initial: "end" }} justify="between" gap="6">
      <Suspense fallback={<span />}>{product.Environment.network === Network.testnet ? <TestnetBadge /> : <span />}</Suspense>
      <Flex direction="row" gap="4" align="center">
        <Suspense>
          <CircleImageIcon image={organization?.image} alt={organization?.name} size={10} />
        </Suspense>
        <Heading as="h1" size={{ initial: "6", sm: "7", md: "8" }} weight="regular" className=" text-white">
          <Suspense>{organization.name}</Suspense>
        </Heading>
      </Flex>
    </Flex>
  )
}
