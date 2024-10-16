"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import {
  createShippingPolicyZone,
  deleteShippingPolicy,
  deleteShippingPolicyTier,
  duplicateShippingPolicy,
  updateShippingPolicy,
  updateShippingPolicySchema,
  updateTier,
  updateTierSchema,
} from "~/_backend/shippingPolicies"

export async function updateShippingPolicyAction(input: z.infer<typeof updateShippingPolicySchema>) {
  const data = updateShippingPolicySchema.parse(input)
  const shippingPolicy = await updateShippingPolicy(data)
  revalidatePath("/")
  return shippingPolicy
}
export async function updateTierAction(input: z.infer<typeof updateTierSchema>) {
  const updatedTier = await updateTier(updateTierSchema.parse(input))
  revalidatePath("/")
  return updatedTier
}

export async function deleteShippingPolicyTierAction(input: { tierId: string }) {
  const data = z
    .object({
      tierId: z.string().uuid(),
    })
    .parse(input)
  await deleteShippingPolicyTier(data.tierId)
  revalidatePath("/")
}

export async function deleteShippingPolicyAction(input: { shippingPolicyId: string }) {
  const data = z
    .object({
      shippingPolicyId: z.string().uuid(),
    })
    .parse(input)
  await deleteShippingPolicy(data.shippingPolicyId)
  revalidatePath("/")
}

export async function duplicateShippingPolicyAction(input: { shippingPolicyId: string }) {
  const data = z
    .object({
      shippingPolicyId: z.string().uuid(),
    })
    .parse(input)
  const duplicatedShippingPolicy = await duplicateShippingPolicy(data.shippingPolicyId)
  revalidatePath("/")
  return duplicatedShippingPolicy
}

export async function createShippingPolicyZoneAction(input: { shippingPolicyId: string }) {
  const data = z
    .object({
      shippingPolicyId: z.string().uuid(),
    })
    .parse(input)
  const shippingPolicyZone = await createShippingPolicyZone(data.shippingPolicyId)
  revalidatePath("/")
  return shippingPolicyZone
}
