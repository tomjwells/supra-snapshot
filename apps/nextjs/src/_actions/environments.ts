"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@acme/db"

import { auth } from "~/utils/auth"

export async function changeEnvironmentAction(environmentId: string) {
  const session = await auth()
  const selectedEnvironment = await prisma.selectedEnvironment.findFirstOrThrow({
    where: {
      userId: session.user.id,
      organizationId: session.user.selectedOrganizationId,
    },
  })
  const entity = await prisma.selectedEnvironment.update({
    where: {
      id: selectedEnvironment.id,
    },
    data: {
      environmentId,
    },
  })
  console.log("entity", entity)

  revalidatePath("/")
}
