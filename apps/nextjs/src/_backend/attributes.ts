import { prisma, ProductStatus } from "@acme/db"
import { z } from "zod"

import { createProduct } from "./products"

export const updateAttributeSchema = z.object({
  mode: z.enum(["dry-run", "wet-run"]),
  collectionId: z.string(),
  attributes: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      orderIndex: z.number().int().min(0),
      values: z.array(
        z.object({
          id: z.string(),
          value: z.string(),
          orderIndex: z.number().int().min(0),
        }),
      ),
    }),
  ),
})

const deleteOrArchiveVariant = async (id: string) => {
  // If the variant has an order, then we archive it, otherwise we delete it
  const variant = await prisma.variant.findFirstOrThrow({
    where: {
      id,
    },
    include: {
      product: {
        include: {
          Payment: true,
        },
      },
    },
  })
  const hasPayment = variant.product ? variant.product.Payment.length > 0 : false
  if (hasPayment) {
    await prisma.variant.update({
      where: {
        id,
      },
      data: {
        product: {
          update: {
            status: ProductStatus.ARCHIVED,
          },
        },
      },
    })
  } else {
    // Delete the variant and it's product
    // Product is delete via CASCADE
    await prisma.variant.delete({
      where: {
        id,
      },
    })
  }
}

function generateCombinations<T>(arrays: T[][]): T[][] {
  // Recursive use of for loop to get all combinations of n arrays
  if (!arrays.length) return [[]]
  const first = arrays[0]
  const rest = arrays.slice(1)
  const combinationsWithoutFirst = generateCombinations(rest)
  const allCombinations = []
  for (let i = 0; i < first.length; i++) {
    const partialCombination = first[i]
    for (let j = 0; j < combinationsWithoutFirst.length; j++) {
      allCombinations.push([partialCombination].concat(combinationsWithoutFirst[j]))
    }
  }
  return allCombinations
}

async function deleteAttributeAndItsValues(environmentId: string, collectionId: string, attributeId: string) {
  // This deletes the attribute values AND updates the orderIndex of the other attributes
  const maxOrderIndex = await getAttributeMaxOrderIndex({ collectionId })
  const entity = await prisma.collectionAttribute.findFirst({
    where: {
      id: attributeId,
      // Verify belongs to the user
      collection: {
        environmentId: environmentId,
      },
    },
  })
  if (!entity) {
    throw new Error("Attribute does not exist")
  }
  // Delete the attributeValues
  await prisma.collectionAttributeValue.deleteMany({
    where: {
      attributeId: entity.id,
    },
  })
  await prisma.collectionAttribute.delete({
    where: {
      id: entity.id,
      // Verify belongs to the user
      collection: {
        environmentId: environmentId,
      },
    },
  })
  if (entity.orderIndex !== maxOrderIndex) {
    // Update the orderIndex of the other attributes
    await prisma.collectionAttribute.updateMany({
      where: {
        collectionId: entity.collectionId,
        orderIndex: {
          gt: entity.orderIndex,
        },
      },
      data: {
        orderIndex: {
          decrement: 1,
        },
      },
    })
  }
  return entity
}

async function getAttributeMaxOrderIndex({ collectionId }: { collectionId: string }) {
  const maxOrder = await prisma.collectionAttribute.findMany({
    where: {
      collectionId,
    },
    select: {
      orderIndex: true,
    },
    orderBy: [
      {
        orderIndex: "desc",
      },
    ],
    take: 1,
  })
  return maxOrder[0]?.orderIndex
}

async function getValueMaxOrderIndex({ attributeId }: { attributeId: string }) {
  const maxOrder = await prisma.collectionAttributeValue.findMany({
    where: {
      attributeId,
    },
    select: {
      orderIndex: true,
    },
    orderBy: [
      {
        orderIndex: "desc",
      },
    ],
    take: 1,
  })
  return maxOrder[0]?.orderIndex
}

export async function createValue(attributeId: string, environmentId: string) {
  // Check the attribute belongs to the user
  if (
    await prisma.collectionAttribute.findFirst({
      where: {
        id: attributeId,
        collection: {
          environmentId,
        },
      },
    })
  ) {
    const maxOrderIndex = await getValueMaxOrderIndex({ attributeId })
    return prisma.collectionAttributeValue.create({
      data: {
        attributeId,
        orderIndex: !!maxOrderIndex || maxOrderIndex === 0 ? maxOrderIndex + 1 : 0,
      },
    })
  } else {
    throw new Error("Attribute does not exist")
  }
}

async function create(collectionId: string, name: string, orderIndex: number) {
  return prisma.collectionAttribute.create({
    data: {
      collectionId,
      name,
      orderIndex,
    },
    include: {
      values: true,
    },
  })
}

export async function updateAttribute(input: z.infer<typeof updateAttributeSchema>, environmentId: string) {
  console.log({ input, environmentId })
  // Check collection belongs to user
  await prisma.collection.findFirst({
    where: {
      id: input.collectionId,
      environmentId,
    },
  })
  // 1. Create/update/delete the attributes
  const attributes = []
  const existingAttributes = await prisma.collectionAttribute.findMany({
    where: {
      collectionId: input.collectionId,
    },
  })
  for (const inputAttribute of input.attributes) {
    // Use an upsert to create/update the attribute
    if (input.mode === "dry-run") {
      console.log("dry-run")
      attributes.push({
        ...inputAttribute,
        id: inputAttribute.id,
      })
    } else {
      const createdAttribute = await prisma.collectionAttribute.upsert({
        where: {
          id: inputAttribute.id || "",
        },
        create: {
          collectionId: input.collectionId,
          name: inputAttribute.name,
          orderIndex: inputAttribute.orderIndex,
        },
        update: {
          name: inputAttribute.name,
          orderIndex: inputAttribute.orderIndex,
        },
      })
      attributes.push({
        ...inputAttribute,
        id: createdAttribute.id,
      })
    }
  }
  // Delete the attributes that are not in the input
  console.log("existingAttributesCount", existingAttributes.length)
  for (const existingAttribute of existingAttributes) {
    console.log("existingAttribute", existingAttribute.id)
    console.log("existingAttributeIsNotFound", existingAttribute.id)
    if (!input.attributes.some((attribute) => attribute.id === existingAttribute.id)) {
      console.log("Deleting attribute")
      if (input.mode === "wet-run") {
        console.log("Deleting attribute")
        await deleteAttributeAndItsValues(environmentId, input.collectionId, existingAttribute.id)
      }
    }
  }

  // 2. Create/update/delete the attributeValues
  const existingAttributeValues = await prisma.collectionAttributeValue.findMany({
    where: {
      attribute: {
        collectionId: input.collectionId,
      },
    },
  })
  for (const inputAttribute of attributes) {
    for (const inputValue of inputAttribute.values) {
      if (input.mode === "wet-run") {
        // Use an upsert to create/update the attributeValue
        await prisma.collectionAttributeValue.upsert({
          where: {
            id: inputValue.id || "",
          },
          create: {
            attribute: {
              connect: {
                id: inputAttribute.id,
              },
            },
            value: inputValue.value,
            orderIndex: inputValue.orderIndex,
          },
          update: {
            value: inputValue.value,
            orderIndex: inputValue.orderIndex,
          },
        })
      }
    }
    // If an attributeValue is not in the input, then delete it
    for (const existingAttributeValue of existingAttributeValues) {
      if (existingAttributeValue.attributeId === inputAttribute.id && !inputAttribute.values.some((value) => value.id === existingAttributeValue.id)) {
        if (input.mode === "wet-run") {
          await prisma.collectionAttributeValue.delete({
            where: {
              id: existingAttributeValue.id,
            },
          })
        }
      }
    }
  }

  let createdVariantCount = 0
  // Create variants for each option-combination (that doesn't already exist)

  console.log({ attributes })
  const refetchAttributes =
    input.mode === "dry-run"
      ? attributes
      : await prisma.collectionAttribute.findMany({
          where: {
            collectionId: input.collectionId,
          },
          include: {
            values: true,
          },
        })
  const optionArrays = refetchAttributes.map((attribute) => attribute.values.map((value) => value.id))
  let combinations = generateCombinations(optionArrays)

  if (combinations[0].length > 0) {
    for (const combination of combinations) {
      // Check if the variant already exists
      console.log({ checkingCombination: combination })
      const allCandidateVariants = await prisma.variant.findMany({
        where: {
          collectionId: input.collectionId,
          attributeValues: {
            every: {
              id: {
                in: combination,
              },
            },
          },
        },
        include: {
          attributeValues: true,
        },
      })
      let existingVariant = null

      for (const candidate of allCandidateVariants) {
        const attributeValueIds = candidate.attributeValues.map((value) => value.id)
        if (combination.every((id) => attributeValueIds.includes(id))) {
          existingVariant = candidate
          break
        }
      }

      console.log({ existingVariant: existingVariant?.id })
      if (!existingVariant) {
        console.log("no variant found for", { combination }, "creating")
        console.log(`Mode=${input.mode} created Variant: `, combination)
        if (input.mode === "wet-run") {
          const product = await createProduct()
          console.log(
            combination.map((id) => ({
              id,
            })),
          )
          await prisma.variant.create({
            data: {
              collection: {
                connect: {
                  id: input.collectionId,
                },
              },
              product: {
                connect: {
                  id: product.id,
                },
              },
              attributeValues: {
                connect: combination.map((id) => ({
                  id,
                })),
              },
            },
          })
        } else {
          createdVariantCount++
        }
      }
    }
  }

  let deletedVariantCount = 0
  // Delete variants that are not in the option-combinations
  const variants = await prisma.variant.findMany({
    where: {
      collectionId: input.collectionId,
      product: {
        status: ProductStatus.ACTIVE,
      },
    },
    include: {
      attributeValues: true,
    },
  })
  console.log({ variants, combinations })
  for (const variant of variants) {
    const attributeValueIds = variant.attributeValues.map((value) => value.id)
    const matchingCombination = combinations.find((combination) => {
      return combination.every((id) => attributeValueIds.includes(id)) && attributeValueIds.every((id) => combination.includes(id))
    })
    console.log("delete?", !matchingCombination)
    if (
      matchingCombination === undefined
    ) {
      console.log(input.mode)
      if (input.mode === "wet-run") {
        console.log("DELETING")
        console.log({ variant })
        await deleteOrArchiveVariant(variant.id)
      } else {
        console.log("deletedVariantCount++")
        deletedVariantCount++
      }
    } else {
      // Remove this from the combiation set, to ensure we only keep one of any given combination
      combinations = combinations.filter((combination) => combination !== matchingCombination)
      console.log("removed", matchingCombination, combinations.length)
    }
  }

  return {
    attributes,
    createdVariantCount,
    deletedVariantCount,
  }
}

export async function deleteValue(id: string, environmentId: string) {
  const maxOrderIndex = await getValueMaxOrderIndex({ attributeId: id })
  const entity = await prisma.collectionAttributeValue.findFirst({
    where: {
      id,
      // Verify belongs to the user
      attribute: {
        collection: {
          environmentId,
        },
      },
    },
  })
  if (!entity) {
    throw new Error("Attribute value does not exist")
  }
  await prisma.collectionAttributeValue.delete({
    where: {
      id: id,
      // Verify belongs to the user
      attribute: {
        collection: {
          environmentId,
        },
      },
    },
  })
  if (entity.orderIndex !== maxOrderIndex) {
    // Update the orderIndex of the other attributes
    await prisma.collectionAttributeValue.updateMany({
      where: {
        attributeId: entity.attributeId,
        orderIndex: {
          gt: entity.orderIndex,
        },
      },
      data: {
        orderIndex: {
          decrement: 1,
        },
      },
    })
  }
  return entity
}
