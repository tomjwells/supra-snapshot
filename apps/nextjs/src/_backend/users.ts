import { cache } from "react"
import { updateImage } from "@acme/cloudinary/cloudinaryHelpersEdge"
import { prisma } from "@acme/db"
import { z } from "zod"

import { auth } from "~/utils/auth"

export const updateUserSchema = z.object({
  name: z.string().optional(),
  image: z.string().optional(),
  imageData: z.string().optional(),
})

export type UserType = Awaited<ReturnType<typeof getUser>>
export const getUser = cache(async () => {
  return prisma.user.findFirstOrThrow({
    where: {
      id: (await auth())?.user?.id,
    },
  })
})

export async function updateUser(input: z.infer<typeof updateUserSchema>) {
  const session = await auth()
  let uploadResult = undefined
  if (input.imageData) {
    uploadResult = await updateImage(input.imageData, input.image ?? "", "users")
  }
  return prisma.user.update({
    where: {
      id: session?.user?.id,
    },
    data: {
      name: input.name ?? undefined,
      image: uploadResult ? uploadResult.public_id : undefined,
    },
  })
}
