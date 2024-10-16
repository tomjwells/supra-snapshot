"use server"

import { revalidatePath } from "next/cache"

import { updateAttribute, updateAttributeSchema } from "~/_backend/attributes"
import { auth } from "~/utils/auth"

export async function updateAttributesAction(input: z.infer<typeof updateAttributeSchema>) {
  const data = updateAttributeSchema.parse(input)
  const session = await auth()
  const attributes = await updateAttribute(data, session.user.selectedEnvironmentId)
  input.mode === "wet-run" && revalidatePath("/")
  return attributes
}
