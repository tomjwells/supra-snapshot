import { prisma } from "@acme/db"

export async function getCustomer(id: string) {
  return prisma.customer.findFirstOrThrow({
    where: {
      id,
    },
  })
}

export async function getCustomerByPaymentId(id: string) {
  return prisma.customer.findFirst({
    where: {
      payment: {
        some: { id },
      },
    },
  })
}
