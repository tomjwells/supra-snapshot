"use server"

import { revalidatePath } from "next/cache"

import { listPaymentsByProductId } from "~/_backend/payments"

export async function listByProductIdPaymentsAction(productId: string) {
  const payments = await listPaymentsByProductId(productId)
  revalidatePath("/")
  return payments
}
