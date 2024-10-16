import { cache } from "react"
import { prisma } from "@acme/db"
import { CheckoutLinkStatus } from "@prisma/client"

export type CheckoutLinkType = Awaited<ReturnType<typeof getCheckoutLink>>

export const getCheckoutLink = cache(async (id: string) => {
  const entity = await prisma.checkoutLink.findUniqueOrThrow({
    where: { id },
    include: {
      collection: {
        include: {
          attributes: {
            include: {
              values: {
                orderBy: {
                  orderIndex: "asc",
                },
              },
            },
            orderBy: {
              orderIndex: "asc",
            },
          },
          variants: {
            orderBy: {
              createdAt: "asc",
            },
            include: {
              attributeValues: {
                orderBy: {
                  orderIndex: "asc",
                },
              },
            },
          },
          Environment: { include: { Organization: true } },
        },
      },
    },
  })
  if (entity && entity?.status === CheckoutLinkStatus.ACTIVE) {
    return entity
  } else {
    console.log("Checkout link status is not active:", entity?.status)
    throw new Error("Checkout link not found")
  }
})
