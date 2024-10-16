"use server"

import { revalidatePath } from "next/cache"
import { PaymentStatus, prisma } from "@acme/db"
import { z } from "zod"

import { archiveCollection, deleteCollection, update, updateCollectionSchema } from "~/_backend/collections"
import { auth } from "~/utils/auth"

export async function updateCollectionAction(input: z.infer<typeof updateCollectionSchema>) {
  const data = updateCollectionSchema.parse(input)
  const collection = await update(data)
  revalidatePath("/")
  return collection
}
export async function archiveCollectionAction(input: { collectionId: string }) {
  const data = z
    .object({
      collectionId: z.string(),
    })
    .parse(input)
  const session = await auth()
  const paymentsCount = await prisma.payment.count({
    where: {
      product: {
        Variant: data,
      },
      status: PaymentStatus.COMPLETE,
    },
  })
  if (paymentsCount === 0) {
    console.log("Deleting")
    const archivedCollection = await deleteCollection(data.collectionId, session.user.selectedEnvironmentId)
    await prisma.payment.deleteMany({
      where: {
        product: {
          Variant: data,
        },
      },
    })
    revalidatePath("/")
    return archivedCollection
  } else {
    console.log("Archiving")
    const archivedCollection = await archiveCollection(data.collectionId, session.user.selectedEnvironmentId)
    revalidatePath("/")
    return archivedCollection
  }
}

export async function deleteCollectionAction(input: { collectionId: string }) {
  const data = z
    .object({
      collectionId: z.string(),
    })
    .parse(input)
  const session = await auth()
  const paymentsCount = await prisma.payment.count({
    where: {
      product: {
        Variant: data,
      },
    },
  })
  if (paymentsCount === 0) {
    await deleteCollection(data.collectionId, session.user.selectedEnvironmentId)
  } else {
    throw new Error("Collection has payments")
  }
  revalidatePath("/")
}
