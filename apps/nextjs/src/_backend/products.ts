import { cache } from "react"
import { updateImage } from "@acme/cloudinary/cloudinaryHelpersEdge"
import { CustomInformationFieldType, prisma, ProductStatus } from "@acme/db"
import { z } from "zod"

import { auth } from "~/utils/auth"

export async function listProducts() {
  return prisma.product.findMany({
    where: {
      environmentId: (await auth()).user.selectedEnvironmentId,
      status: ProductStatus.ACTIVE,
    },
    include: {
      Environment: true,
      currency: true,
      acceptedCurrencies: true,
      Variant: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  })
}
export type ProductType = Awaited<ReturnType<typeof getProduct>>
export const getProduct = cache(async (id: string) => {
  const session = await auth()

  return prisma.product.findFirst({
    where: {
      id,
      environmentId: session.user.selectedEnvironmentId,
    },
    include: {
      ShippingPolicy: true,
      currency: true,
      acceptedCurrencies: true,
      Environment: true,
      collect_custom_information: {
        orderBy: {
          orderIndex: "asc",
        },
      },
    },
  })
})

export async function createProduct() {
  return prisma.product.create({
    data: {
      Environment: {
        connect: {
          id: (await auth()).user.selectedEnvironmentId,
        },
      },
      currency: {
        connect: {
          id: (await prisma.currencies.findFirstOrThrow({ where: { ticker: "DJED" } })).id,
        },
      },
      acceptedCurrencies: {
        connect: await prisma.currencies.findMany({
          where: {
            ticker: {
              in: ["DJED", "ADA", "iUSD"],
            },
            enabled: true,
          },
        }),
      },
    },
  })
}

export async function duplicateProduct(id: string) {
  const product = await getProduct(id)
  if (!product) throw new Error("Product not found")
  const newProduct = await prisma.product.create({
    data: {
      Environment: {
        connect: {
          id: (await auth()).user.selectedEnvironmentId,
        },
      },
      currency: {
        connect: {
          id: product.currencyId,
        },
      },
      acceptedCurrencies: {
        connect: product.acceptedCurrencies.map((currency) => {
          return {
            id: currency.id,
          }
        }),
      },
      name: product.name,
      description: product.description,
      image: product.image,
      price: product.price,
      withdrawalMethod: product.withdrawalMethod,
      // Collect Customer Information
      collect_email: product.collect_email,
      collect_address: product.collect_address,
      // Inventory
      inventory_track: product.inventory_track,
      inventory_continueSelling: product.inventory_continueSelling,
      inventory_quantity: product.inventory_quantity,
    },
  })
  return newProduct
}

export const updateProductSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  imageData: z.string().optional(),
  price: z.union([z.string().refine((value) => !isNaN(Number(value))), z.nan()]).optional(), // Needs to be this awkward to allow undefined numbers https://github.com/orgs/react-hook-form/discussions/6980#discussioncomment-6243123
  currencyId: z.string().uuid().optional(),
  acceptedCurrencies: z
    .array(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .optional(),
  withdrawalMethod: z.enum(["instant", "manual"]).optional(),
  // Customer Information
  collect_email: z.boolean().optional(),
  collect_address: z.boolean().optional(),
  collect_custom_information: z
    .array(
      z.object({
        id: z.string().optional(),
        orderIndex: z.number(),
        request: z.string(),
        field_type: z.nativeEnum(CustomInformationFieldType),
      }),
    )
    .optional(),
  // Inventory
  inventory_track: z.boolean().optional(),
  inventory_continueSelling: z.boolean().optional(),
  inventory_quantity: z
    .number()
    .min(0, {
      message: "Quantity must be greater than 0.",
    })
    .optional(),
  // Variable quantity
  quantity_variable: z.boolean().optional(),
  quantity_minimum: z.number().min(1).optional(),
  quantity_maximum: z.number().min(1).optional(),
  // Shipping
  shippingPolicyId: z.string().uuid().optional(),
})

export async function updateProduct(input: z.infer<typeof updateProductSchema>) {
  const product = await getProduct(input.id)
  if (!product) throw new Error("Product not found")

  let uploadResult
  if (input.imageData) {
    uploadResult = await updateImage(input.imageData, product.image ?? input.image, "products")
  }

  return await prisma.product.update({
    where: {
      id: input.id,
    },
    data: {
      name: input.name ?? undefined,
      image: uploadResult ? uploadResult?.public_id : undefined,
      description: input.description ?? undefined,
      price: input.price ?? undefined,
      currency: input.currencyId
        ? {
            connect: {
              id: input.currencyId,
            },
          }
        : undefined,
      acceptedCurrencies: {
        connect: input.acceptedCurrencies,
        disconnect: !input.acceptedCurrencies
          ? undefined
          : await prisma.currencies.findMany({ where: { enabled: true } }).then((currencies) => {
              return currencies.filter((currency) => {
                return !input.acceptedCurrencies?.some((acceptedCurrency) => {
                  return acceptedCurrency.id === currency.id
                })
              })
            }),
      },
      withdrawalMethod: input.withdrawalMethod ?? undefined,
      // Collect Customer Information
      collect_email: input.collect_email ?? undefined,
      collect_address: input.collect_address ?? undefined,
      collect_custom_information: {
        upsert: !input.collect_custom_information
          ? undefined
          : input.collect_custom_information.map((customInformation) => {
              return {
                where: {
                  // Odd prisma issue where it doesn't accept undefined, so you have to create a nonexistant id: https://github.com/prisma/prisma/issues/4747
                  id: customInformation.id ?? "1",
                },
                create: {
                  request: customInformation.request,
                  orderIndex: customInformation.orderIndex,
                  field_type: customInformation.field_type,
                },
                update: {
                  request: customInformation.request,
                  orderIndex: customInformation.orderIndex,
                  field_type: customInformation.field_type,
                },
              }
            }),
        disconnect: !input.collect_custom_information
          ? undefined
          : await prisma.customInformation.findMany({ where: { productId: input.id } }).then((customInformation) => {
              return customInformation.filter((customInformation) => {
                return !input.collect_custom_information?.some((customInformationInput) => {
                  return customInformationInput.id === customInformation.id
                })
              })
            }),
      },
      // Inventory
      inventory_track: input.inventory_track,
      inventory_continueSelling: input.inventory_continueSelling,
      inventory_quantity: input.inventory_quantity,
      // Variable Quantity
      quantity_variable: input.quantity_variable,
      quantity_minimum: input.quantity_minimum,
      quantity_maximum: input.quantity_maximum,
      // Shipping
      ShippingPolicy: input.shippingPolicyId
        ? {
            connect: {
              id: input.shippingPolicyId,
            },
          }
        : undefined,
    },
    include: {
      currency: true,
      acceptedCurrencies: true,
      ShippingPolicy: true,
    },
  })
}

export const deleteProduct = async (productId: string) => {
  const session = await auth()
  const paymentsCount = await prisma.payment.count({
    where: {
      productId,
    },
  })
  if (paymentsCount === 0) {
    await prisma.product.delete({
      where: {
        id: productId,
        environmentId: session.user.selectedEnvironmentId,
      },
    })
    await prisma.checkoutLink.deleteMany({
      // There's no point keeping these dangling checkoutLinks around
      where: {
        productId,
      },
    })
    return
  } else {
    throw new Error("Product has payments")
  }
}
