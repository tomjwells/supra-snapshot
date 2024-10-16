import { prisma } from "@acme/db"

export async function listWebhooks(environmentId: string) {
  // Get payments by environment
  // https://stackoverflow.com/questions/72748994/prisma-where-with-deeply-nested-relation
  return prisma.webhook.findMany({
    where: {
      environmentId,
    },
    orderBy: {
      createdAt: "asc",
    },
  })
}
export async function getWebhook(environmentId: string) {
  // Use the environmentId to get the webhook since there is only one webhook per environment (for now)
  const webhook = await prisma.webhook.findFirst({
    where: {
      environmentId,
    },
  })
  if (!webhook) {
    console.log("Creating webhook")
    // Now create the webhook for this environment
    return await create(environmentId)
  }
  return webhook
}

export async function create(environmentId: string) {
  return prisma.webhook.create({
    data: {
      environmentId,
    },
  })
}
