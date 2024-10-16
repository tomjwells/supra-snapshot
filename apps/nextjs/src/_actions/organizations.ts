"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { create } from "@acme/auth/organizationsHelper"
import { OrganizationTier, prisma } from "@acme/db"
import { z } from "zod"

import { auth } from "~/utils/auth"

export async function changeOrganizationAction(input: { organizationId: string }) {
  const data = z
    .object({
      organizationId: z.string(),
    })
    .parse(input)
  const session = await auth()
  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      selectedOrganizationId: data.organizationId,
    },
  })

  revalidatePath("/")
}

export async function addOrganizationAction() {
  const session = await auth()
  const { organization } = await create({ name: "", imageData: "", tier: OrganizationTier.FREE }, session.user.id)

  // Now change the selected organization
  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      selectedOrganizationId: organization.id,
    },
  })

  redirect("/settings")
  return organization
}
