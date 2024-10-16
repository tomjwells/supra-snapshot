import { updateImage } from "@acme/cloudinary/cloudinaryHelpersEdge"
import { db } from "@acme/db-drizzle/client";
import { Organization, Environment, SelectedEnvironment, User, OrganizationTier } from '@acme/db-drizzle/schema'
import { eq } from 'drizzle-orm';

import { createEnvironment } from "./environmentsHelper"
import { z } from "zod";

export async function createOrganization(
  input: { name: string; imageData: string; tier: (typeof Organization)['tier']['enumValues'][number] },
  userId: string,
) {
  let uploadResult = undefined
  if (input.imageData) {
    uploadResult = await updateImage(input.imageData, "", "organizations")
  }

  const [organization] = await db.insert(Organization).values({
    name: input.name,
    image: uploadResult ? uploadResult.public_id : undefined,
    userId: userId,
    tier: input.tier,
  }).returning();
  if(!organization) throw new Error('Failed to create organization')

  console.log("CREATED ORG", organization, input)

  // Create live and test environments
  const liveEnvironment = await createEnvironment(
    { name: "Live", type: "production" },
    organization.id,
    userId,
  )
  const testEnvironment = await createEnvironment(
    { name: "Test", type: "test" },
    organization.id,
    userId,
  )

  const [selectedEnvironment] = await db.insert(SelectedEnvironment).values({
    userId: userId,
    organizationId: organization.id,
    environmentId: liveEnvironment.id,
  }).returning();

  // Update the user
  const [updatedUser] = await db.update(User)
    .set({
      personalOrganizationId: organization.id,
      selectedOrganizationId: organization.id,
    })
    .where(eq(User.id, userId))
    .returning();

  return { organization, liveEnvironment, testEnvironment, selectedEnvironment }
}