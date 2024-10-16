"use server"

import { revalidatePath } from "next/cache"
import type { z } from "zod"

import { create, createCheckoutLinkSchema, update, updateCheckoutLinkSchema } from "~/_backend/checkoutLinks"

export async function createCheckoutLinkAction(input: z.infer<typeof createCheckoutLinkSchema>) {
  const data = createCheckoutLinkSchema.parse(input)
  const checkoutLink = await create(data)
  revalidatePath("/")
  return checkoutLink
}

export async function editCheckoutLinkAction(input: z.infer<typeof updateCheckoutLinkSchema>) {
  const data = updateCheckoutLinkSchema.parse(input)
  const checkoutLink = await update(data)
  revalidatePath("/")
  return checkoutLink
}
