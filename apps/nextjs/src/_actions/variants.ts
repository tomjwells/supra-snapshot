"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@acme/db"
import { z } from "zod"

import { deleteVariant, getVariant } from "~/_backend/variants"
import { auth } from "~/utils/auth"

export async function deleteVariantAction(input: { variantId: string }) {
  const data = z
    .object({
      variantId: z.string(),
    })
    .parse(input)
  await deleteVariant(data.variantId)
  revalidatePath("/")
}

const dashboardSectionNameSchema = z.enum(["Product Information", "Customer Information", "Inventory"])

export async function copyVariantInformationAction(id: string, dashboardSectionNameArg: string) {
  const dashboardSectionName = dashboardSectionNameSchema.parse(dashboardSectionNameArg)

  const variant = await getVariant(id)
  if (!variant) throw Error("No variant found")
  if (!variant.product) throw Error("No product found")

  const productsToUpdate = await prisma.product.findMany({
    where: {
      Variant: {
        collectionId: variant.collectionId,
        NOT: {
          id: variant.product.id,
        },
      },
      environmentId: (await auth()).user.selectedEnvironmentId,
    },
    include: {
      acceptedCurrencies: true,
      collect_custom_information: true,
    },
  })
  await prisma.$transaction(
    productsToUpdate.map((product) => {
      switch (dashboardSectionName) {
        case "Product Information":
          return prisma.product.update({
            where: {
              id: product.id,
            },
            data: {
              name: variant?.product?.name,
              description: variant?.product?.description,
              image: variant?.product?.image,
              price: variant?.product?.price,
              currencyId: variant?.product?.currencyId,
              acceptedCurrencies: {
                set: [],
                connect: variant?.product?.acceptedCurrencies?.map((currency) => ({
                  id: currency.id,
                })),
              },
            },
          })
        case "Customer Information":
          return prisma.product.update({
            where: {
              id: product.id,
            },
            data: {
              collect_email: variant?.product?.collect_email,
              collect_address: variant?.product?.collect_address,
              ShippingPolicy: {
                connect: variant?.product?.shippingPolicyId
                  ? {
                      id: variant.product.shippingPolicyId,
                    }
                  : undefined,
              },
              collect_custom_information: {
                set: [],
                create: variant?.product?.collect_custom_information.map((info) => ({
                  ...info,
                  id: undefined,
                  productId: undefined,
                })),
              },
              quantity_variable: variant?.product?.quantity_variable,
              quantity_maximum: variant?.product?.quantity_maximum,
              quantity_minimum: variant?.product?.quantity_minimum,
            },
          })

        case "Inventory":
          return prisma.product.update({
            where: {
              id: product.id,
            },
            data: {
              inventory_track: variant?.product?.inventory_track,
              inventory_quantity: variant?.product?.inventory_quantity,
              inventory_continueSelling: variant?.product?.inventory_continueSelling,
            },
          })
      }
    }),
  )

  return
}
