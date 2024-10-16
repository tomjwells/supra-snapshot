import { prisma, ProductStatus } from "@acme/db"
import { z } from "zod"

import { auth } from "~/utils/auth"
import { createProduct } from "./products"

export async function getVariant(id: string) {
  return prisma.variant.findUnique({
    where: {
      id,
    },
    include: {
      attributeValues: {
        include: {
          attribute: true,
        },
      },
      product: {
        include: {
          acceptedCurrencies: true,
          collect_custom_information: true,
        },
      },
    },
  })
}

export type VariantsType = Awaited<ReturnType<typeof listByCollectionId>>
export async function listByCollectionId(collectionId: string) {
  return prisma.variant.findMany({
    where: {
      collectionId,
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      product: {
        include: {
          Environment: true,
          currency: true,
        },
      },
      attributeValues: {
        include: {
          attribute: true,
        },
      },
    },
  })
}

export async function createVariant(collectionId: string, environmentId: string) {
  if (
    await prisma.collection.findFirst({
      where: {
        id: collectionId,
        environmentId,
      },
    })
  ) {
    const product = await createProduct()
    return prisma.variant.create({
      data: {
        collectionId,
        product: {
          connect: {
            id: product.id,
          },
        },
      },
    })
  } else {
    throw new Error("Collection does not exist")
  }
}

export const editVariantSchema = z.object({
  id: z.string(), // This is the collection id
  variants: z.array(
    z.object({
      id: z.string(),
      productId: z.string().optional().nullable(),
      attributeValues: z
        .array(
          z
            .object({
              id: z.string().optional(),
            })
            .optional(),
        )
        .optional(),
    }),
  ),
})
export async function updateVariant(input: z.infer<typeof editVariantSchema>) {
  const collectionAttributes = await prisma.collectionAttribute.findMany({
    where: {
      collectionId: input.id,
    },
    include: {
      values: {
        orderBy: {
          orderIndex: "asc",
        },
      },
    },
  })
  const entity = await prisma.collection.update({
    where: {
      id: input.id,
    },
    data: {
      variants: {
        update: input.variants.map((variant) => ({
          where: {
            id: variant.id,
          },
          data: {
            productId: variant.productId,
            attributeValues: {
              set: collectionAttributes
                .map((attribute) => ({
                  id: variant.attributeValues?.find((attributeValue) => attribute?.values?.map((v) => v.id).includes(attributeValue?.id || "999"))?.id,
                }))
                .filter((attributeValue) => !!attributeValue?.id),
            },
          },
        })),
      },
    },
  })
  return entity
}

export async function deleteVariant(id: string) {
  const session = await auth()
  const variant = await prisma.variant.findUnique({
    where: {
      id,
      collection: {
        environmentId: session.user.selectedEnvironmentId,
      },
    },
    include: {
      product: {
        include: {
          Payment: true,
        },
      },
    },
  })

  if (!variant) {
    throw new Error("Variant not found")
  }
  if (!variant.product) {
    throw new Error("Variant not returned with product")
  }

  if (variant.product.Payment.length > 0) {
    await prisma.product.update({
      where: {
        variantId: variant.id,
      },
      data: {
        status: ProductStatus.ARCHIVED,
      },
    })
  } else {
    const [deletedVariant] = await prisma.$transaction([
      prisma.variant.delete({
        where: {
          id,
          collection: {
            environmentId: session.user.selectedEnvironmentId,
          },
        },
      }),
    ])
    return deletedVariant
  }
  return variant
}
