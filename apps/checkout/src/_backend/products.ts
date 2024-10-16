import { cache } from "react"
import { Prisma, prisma, ProductStatus } from "@acme/db"
import { and, count, eq } from "@acme/db-drizzle"
import { db } from "@acme/db-drizzle/client"
import { Environment, Network, NotificationSource, NotificationSourceStatus, NotificationSourceType, Product, User } from "@acme/db-drizzle/schema"

import type { CheckoutLinkType } from "./checkoutLinks"

export type ProductType = Awaited<ReturnType<typeof getProduct>>

// https://github.com/prisma/prisma/issues/17473#issuecomment-1799491831
export const productInclude = Prisma.validator(
  prisma,
  "variant",
  "findFirstOrThrow",
  "include",
)({
  product: {
    include: {
      Environment: { include: { Organization: true } },
      Variant: {
        include: {
          attributeValues: {
            orderBy: {
              orderIndex: "asc",
            },
          },
        },
      },
      currency: true,
      acceptedCurrencies: {
        orderBy: {
          orderIndex: "asc",
        },
      },
      collect_custom_information: {
        orderBy: {
          orderIndex: "asc",
        },
      },
      ShippingPolicy: {
        include: {
          ShippingPolicyZone: {
            include: {
              currency: true,
              countries: {
                orderBy: {
                  name: "asc",
                },
              },
            },
          },
        },
      },
    },
  },
})

export function getProduct(id: string) {
  return prisma.product.findUnique({
    where: {
      id,
      status: ProductStatus.ACTIVE,
    },
    include: productInclude.product.include,
  })
}


export const getDefaultCollectionProduct = cache(async (checkoutLinkId: string) => {
  const selectedVariant = await prisma.variant.findFirstOrThrow({
    orderBy: {
      createdAt: "asc",
    },
    where: {
      collection: {
        CheckoutLink: {
          some: {
            id: checkoutLinkId,
          },
        },
      },
      product: {
        status: ProductStatus.ACTIVE,
      },
    },
    include: productInclude,
  })
  return selectedVariant.product
})
export const getProductByVariant = cache(async (variantId: string) => {
  return prisma.product.findFirst({
    where: {
      Variant: {
        id: variantId,
      },
    },
    include: productInclude.product.include,
  })
})

export const getProductFrom = cache(async (checkoutLink: CheckoutLinkType, variant: string | undefined) => {
  let product
  if (checkoutLink.collectionId) {
    product = variant ? await getProductByVariant(variant) : await getDefaultCollectionProduct(checkoutLink.id)
  } else if (checkoutLink.productId) {
    product = await getProduct(checkoutLink.productId)
  }
  return product
})
