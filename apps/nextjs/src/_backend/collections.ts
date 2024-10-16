import { cache } from "react"
import { CollectionStatus, prisma } from "@acme/db"
import { z } from "zod"

import { auth } from "~/utils/auth"

export type CollectionsType = Awaited<ReturnType<typeof listCollections>>
export const listCollections = cache((environmentId: string) => {
  if (!environmentId) throw new Error("No environmentId")
  return prisma.collection.findMany({
    where: {
      environmentId,
      status: CollectionStatus.ACTIVE,
    },
    include: {
      Environment: true,
      variants: true,
      attributes: {
        include: {
          values: {
            orderBy: {
              orderIndex: "asc",
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  })
})

export type CollectionType = Awaited<ReturnType<typeof getCollection>>
export const getCollection = cache(async (id: string) => {
  const environmentId = (await auth()).user.selectedEnvironmentId
  return prisma.collection.findFirst({
    where: {
      id,
      environmentId,
      status: CollectionStatus.ACTIVE,
    },
    include: {
      Environment: true,
      attributes: {
        include: {
          values: {
            orderBy: {
              orderIndex: "asc",
            },
          },
        },
        orderBy: {
          orderIndex: "asc",
        },
      },
      variants: {
        orderBy: {
          createdAt: "asc",
        },
        include: {
          product: {
            include: {
              Environment: true,
              currency: true,
            },
          },
          attributeValues: {
            orderBy: {
              orderIndex: "asc",
            },
          },
        },
      },
    },
  })
})

export function createCollection(environmentId: string) {
  return prisma.collection.create({
    data: {
      name: "",
      environmentId,
    },
  })
}

export async function archiveCollection(id: string, environmentId: string) {
  const entity = await prisma.$transaction([
    prisma.collection.update({
      where: {
        id,
        environmentId,
      },
      data: {
        status: CollectionStatus.ARCHIVED,
      },
    }),
    prisma.checkoutLink.updateMany({
      where: {
        collectionId: id,
      },
      data: {
        status: CollectionStatus.ARCHIVED,
      },
    }),
  ])
  return entity
}

export async function deleteCollection(id: string, environmentId: string) {
  const entity = await prisma.collection.delete({
    where: {
      id,
      environmentId,
    },
  })
  return entity
}

export const updateCollectionSchema = z.object({
  id: z.string(),
  name: z.string(),
})
export async function update(input: z.infer<typeof updateCollectionSchema>) {
  return await prisma.collection.update({
    where: {
      id: input.id,
    },
    data: {
      name: input.name || undefined,
    },
  })
}
