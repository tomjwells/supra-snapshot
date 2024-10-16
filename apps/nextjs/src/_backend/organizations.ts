import { cache } from "react"
import { updateImage } from "@acme/cloudinary/cloudinaryHelpersEdge"
import { OrganizationTier, prisma } from "@acme/db"
import { z } from "zod"

import { auth } from "~/utils/auth"

export const updateOrganizationSchema = z.object({
  name: z.string().optional(),
  image: z.string().optional(),
  imageData: z.string().optional(),
  mainnetWithdrawalAddress: z
    .string()
    .trim()
    .startsWith("addr1", 'Check whether the withdrawal address is formatted correctly (it should start with "addr1").')
    .optional()
    .or(z.literal("")),
  testnetWithdrawalAddress: z
    .string()
    .trim()
    .startsWith("addr_test1", "Check whether the withdrawal address is formatted correctly.")
    .optional()
    .or(z.literal("")),
  tier: z.nativeEnum(OrganizationTier).optional(),
})

export type OrganizationType = Awaited<ReturnType<typeof getOrganization>>
export const getOrganization = cache(async () => {
  const session = await auth()
  return prisma.organization.findFirstOrThrow({
    where: {
      id: session.user.selectedOrganizationId,
      userId: session.user.id,
    },
  })
})

export async function listOrganizations() {
  return prisma.organization.findMany({
    where: {
      userId: (await auth()).user.id,
    },
    orderBy: {
      createdAt: "asc",
    },
  })
}

export async function updateOrganization(input: z.infer<typeof updateOrganizationSchema>) {
  const session = await auth()
  let uploadResult = undefined
  if (input.imageData) {
    uploadResult = await updateImage(input.imageData, input.image, "organizations")
  }
  return prisma.organization.update({
    where: {
      id: session?.user?.selectedOrganizationId,
    },
    data: {
      name: input.name ?? undefined,
      image: uploadResult ? uploadResult.public_id : undefined,
      testnetWithdrawalAddress: input.testnetWithdrawalAddress ?? undefined,
      mainnetWithdrawalAddress: input.mainnetWithdrawalAddress ?? undefined,
      tier: input.tier ?? undefined,
    },
  })
}

export async function deleteOrganization(id: string) {
  const session = await auth()
  const deletedEntity = await prisma.organization.delete({
    where: {
      id: id,
      selectedOrganization: {
        some: {
          id: session?.user?.selectedOrganizationId,
        },
      },
    },
  })
  return deletedEntity
}
