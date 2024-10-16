"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { deleteNotificationSource, updateNotificationSource, updateNotificationSourceSchema } from "~/_backend/notificationSources"

export async function updateNotificationSourcesAction(input: z.infer<typeof updateNotificationSourceSchema>) {
  const data = updateNotificationSourceSchema.parse(input)
  const notificationSource = await updateNotificationSource(data)
  revalidatePath("/")
  return notificationSource
}

export async function deleteNotificationSourceAction(input: { id: string }) {
  const data = z
    .object({
      id: z.string(),
    })
    .parse(input)
  const deletedNotificationSource = await deleteNotificationSource(data.id)
  revalidatePath("/")
  return deletedNotificationSource
}
