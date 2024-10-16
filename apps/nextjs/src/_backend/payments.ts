import { cache } from "react"
import { prisma } from "@acme/db"
import { PaymentStatus } from "@prisma/client"

import { auth } from "~/utils/auth"

export type PaymentsType = Awaited<ReturnType<typeof listPayments>>
export const listPayments = cache(async (from = new Date(0), to = new Date()) => {
  const environmentId = (await auth()).user.selectedEnvironmentId

  // Get payments by organizationId
  // https://stackoverflow.com/questions/72748994/prisma-where-with-deeply-nested-relation
  console.log({ environmentId, from, to })
  return prisma.payment.findMany({
    where: {
      product: { is: { Environment: { is: { id: environmentId } } } },
      status: PaymentStatus.COMPLETE,
      createdAt: {
        gte: from,
        lte: to,
      },
    },
    include: {
      product: true,
      customer: true,
      totalAmountChargedCurrency: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })
})
export async function listPaymentsByProductId(productId: string) {
  const environmentId = (await auth()).user.selectedEnvironmentId
  // Get payments by organizationId
  // https://stackoverflow.com/questions/72748994/prisma-where-with-deeply-nested-relation
  return prisma.payment.findMany({
    where: {
      product: { is: { Environment: { is: { id: environmentId } } } },
      status: PaymentStatus.COMPLETE,
      productId: productId,
    },
    include: {
      product: true,
      customer: true,
      totalAmountChargedCurrency: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}
export async function listPaymentsByCheckoutLinkId(checkoutLinkId: string) {
  // Get payments by checkoutLinkId
  // https://stackoverflow.com/questions/72748994/prisma-where-with-deeply-nested-relation
  return prisma.payment.findMany({
    where: {
      product: { is: { Environment: { is: { id: (await auth()).user.selectedEnvironmentId } } } },
      status: PaymentStatus.COMPLETE,
      checkoutLinkId,
    },
    include: {
      product: true,
      customer: true,
      totalAmountChargedCurrency: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}
export async function listPaymentsByCollectionId(collectionId: string) {
  // Get payments by organizationId
  // https://stackoverflow.com/questions/72748994/prisma-where-with-deeply-nested-relation
  return prisma.payment.findMany({
    where: {
      // Find the payments by their connection through the checkoutLink (we don't store the collectionId on the payment)
      checkoutLink: { is: { collectionId } },
      status: PaymentStatus.COMPLETE,
    },
    include: {
      product: true,
      customer: true,
      totalAmountChargedCurrency: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}

export type PaymentType = Awaited<ReturnType<typeof getPayment>>
export const getPayment = cache(async (id: string, environmentId: string) => {
  // Do no use FindFirstOrThrow so that we can handle the redirect in the payment page
  return prisma.payment.findFirst({
    where: {
      id,
      product: { is: { Environment: { is: { id: environmentId } } } },
    },
    include: {
      CustomerPaymentPhysicalAddress: true,
      totalAmountChargedCurrency: true,
      customerCustomInformation: {
        orderBy: {
          orderIndex: "asc",
        },
      },
    },
  })
})
