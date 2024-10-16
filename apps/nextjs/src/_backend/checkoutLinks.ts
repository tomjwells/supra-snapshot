import { cache } from "react"
import { prisma } from "@acme/db"
import { CheckoutLinkStatus } from "@prisma/client"
import { z } from "zod"

export const createCheckoutLinkSchema = z.object({
  productId: z.string().optional(),
  collectionId: z.string().optional(),
})
export async function create(input: z.infer<typeof createCheckoutLinkSchema>) {
  if (input.productId) {
    return prisma.checkoutLink.create({
      data: {
        product: {
          connect: {
            id: input.productId,
          },
        },
      },
    })
  } else if (input.collectionId) {
    return prisma.checkoutLink.create({
      data: {
        collection: {
          connect: {
            id: input.collectionId,
          },
        },
      },
    })
  } else {
    throw new Error("Must provide productId or collectionId")
  }
}

export const getCheckoutLink = cache(async (id: string) => {
  const checkoutLink = await prisma.checkoutLink.findUniqueOrThrow({
    where: { id },
    include: {
      product: {
        include: { Environment: { include: { Organization: true } }, currency: true, acceptedCurrencies: true },
      },
    },
  })
  if (checkoutLink && checkoutLink?.status === CheckoutLinkStatus.ACTIVE) {
    return checkoutLink
  } else {
    throw new Error("Checkout link not found")
  }
})

export type CheckoutLinks = Awaited<ReturnType<typeof listCheckoutLinks>>
export const listCheckoutLinks = cache((environmentId: string) => {
  return prisma.checkoutLink.findMany({
    where: {
      product: {
        Environment: {
          id: environmentId,
        },
      },
      status: CheckoutLinkStatus.ACTIVE,
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      product: {
        include: { Environment: { include: { Organization: true } }, currency: true, acceptedCurrencies: true },
      },
    },
  })
})

export const listByProductId = cache((productId: string) => {
  return prisma.checkoutLink.findMany({
    where: {
      productId,
      status: CheckoutLinkStatus.ACTIVE,
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      product: {
        include: { Environment: { include: { Organization: true } }, currency: true, acceptedCurrencies: true },
      },
    },
  })
})

export const listByCollectionId = cache((collectionId: string) => {
  return prisma.checkoutLink.findMany({
    where: {
      collectionId,
      status: CheckoutLinkStatus.ACTIVE,
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      product: {
        include: { Environment: { include: { Organization: true } }, currency: true, acceptedCurrencies: true },
      },
    },
  })
})

export const updateCheckoutLinkSchema = z.object({
  id: z.string().optional(),
  status: z.nativeEnum(CheckoutLinkStatus).optional(),
  redirect: z.boolean().optional(),
  redirectUrl: z.string().url().optional(),
})

export async function update(input: z.infer<typeof updateCheckoutLinkSchema>) {
  return prisma.checkoutLink.update({
    where: {
      id: input.id,
    },
    data: {
      status: input.status,
      redirect: input.redirect,
      redirectUrl: input.redirectUrl,
    },
  })
}
