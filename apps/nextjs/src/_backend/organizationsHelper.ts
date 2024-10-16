import { create as createEnvironment } from "@acme/auth/environmentsHelper"
import { updateImage } from "@acme/cloudinary/cloudinaryHelpersEdge"
import { prisma } from "@acme/db"


export async function createOrganization(input: { name: string; imageData: string }, userId: string) {
  let uploadResult = undefined
  if (input.imageData) {
    uploadResult = await updateImage(input.imageData, "", "organizations")
  }
  const organization = await prisma.organization.create({
    data: {
      name: input.name,
      image: uploadResult ? uploadResult.public_id : undefined,
      userId: userId,
    },
  })

  // Create live and test environments
  const liveEnvironment = await createEnvironment({ name: "Live", type: "production" }, organization.id, userId)
  const testEnvironment = await createEnvironment({ name: "Test", type: "test" }, organization.id, userId)

  // Need to create an initial selectedEnvironment
  const selectedEnvironment = await prisma.selectedEnvironment.create({
    data: {
      userId: userId,
      organizationId: organization.id,
      environmentId: liveEnvironment.id,
    },
  })

  // Update the user
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      personalOrganizationId: organization.id,
      selectedOrganizationId: organization.id,
    },
  })
  return { organization, liveEnvironment, testEnvironment, selectedEnvironment }
}
