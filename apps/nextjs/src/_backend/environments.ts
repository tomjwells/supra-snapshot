import { cache } from "react"
import { prisma } from "@acme/db"

import { auth } from "~/utils/auth"

export type EnvironmentType = Awaited<ReturnType<typeof getEnvironment>>
export const getEnvironment = cache(async () => {
  const session = await auth()
  return prisma.environment.findFirstOrThrow({
    where: {
      id: session.user.selectedEnvironmentId,
      organizationId: session.user.selectedOrganizationId,
    },
  })
})

export async function listEnvironments() {
  const session = await auth()
  return prisma.environment.findMany({
    where: {
      organizationId: session.user.selectedOrganizationId,
    },
    orderBy: {
      createdAt: "asc",
    },
  })
}
