import { cache } from "react"
import { prisma, Region } from "@acme/db"
import { z } from "zod"

import { auth } from "~/utils/auth"
import { listCurrenciesIncludingFiat } from "./currencies"

export async function listShippingPolicies() {
  return prisma.shippingPolicy.findMany({
    where: {
      environmentId: (await auth()).user.selectedEnvironmentId,
    },
    include: {
      Product: true,
      Environment: true,
      ShippingPolicyZone: {
        orderBy: {
          createdAt: "asc",
        },
        include: {
          countries: true,
          currency: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  })
}
export type ShippingPolicyType = Awaited<ReturnType<typeof getShippingPolicy>>
export const getShippingPolicy = cache(async (id: string) => {
  // Use findFirst rather than findFirstOrThrow so that we can handle the redirect on the client
  // I tried very hard, but couldn't ind a good way to redirect on prisma throwing an error. You can still get the typesafety just using
  // if (!shippingPolicy) return redirect(`/shippingPolicys`)
  // This works nicely aswell, in that if I try to access another user's shippingPolicy, it just redirects me to the shippingPolicys page (unintended but useful consequence)
  // return prisma.shippingPolicy.findFirstOrThrow({
  return prisma.shippingPolicy.findFirst({
    where: {
      id,
      environmentId: (await auth()).user.selectedEnvironmentId,
    },
    include: {
      Product: true,
      Environment: true,
      ShippingPolicyZone: {
        orderBy: {
          createdAt: "asc",
        },
        include: {
          countries: true,
          currency: true,
        },
      },
    },
  })
})

export async function createShippingPolicy() {
  return prisma.shippingPolicy.create({
    data: {
      name:
        "Shipping Policy " +
        (
          (await prisma.shippingPolicy.count({
            where: {
              environmentId: (await auth()).user.selectedEnvironmentId,
            },
          })) + 1
        ).toString(),
      Environment: {
        connect: {
          id: (await auth()).user.selectedEnvironmentId,
        },
      },
    },
  })
}

export async function duplicateShippingPolicy(id: string) {
  const shippingPolicy = await getShippingPolicy(id)
  if (!shippingPolicy) throw new Error("ShippingPolicy not found")
  const newShippingPolicy = await prisma.shippingPolicy.create({
    data: {
      Environment: {
        connect: {
          id: (await auth()).user.selectedEnvironmentId,
        },
      },

      name: shippingPolicy.name,
      ShippingPolicyZone: {
        create: shippingPolicy.ShippingPolicyZone.map((tier) => ({
          price: tier.price,
          each_additional: tier.each_additional,
          currency: {
            connect: {
              id: tier.currencyId,
            },
          },
          countries: {
            connect: tier.countries.map((country) => ({
              id: country.id,
            })),
          },
        })),
      },
    },
  })
  return newShippingPolicy
}

export const updateTierSchema = z.object({
  id: z.string(),
  // Best way of handling Prisma Decimals: https://github.com/shadcn-ui/ui/issues/421#issuecomment-1561080201
  price: z.coerce.number().min(0),
  each_additional: z.coerce.number().min(0),
  currencyId: z.string().uuid().optional(),
  countries: z.array(
    z.object({
      id: z.string().uuid(),
      name: z.string(),
      code: z.string(),
      region: z.nativeEnum(Region),
      shippingPolicyZoneId: z.string().nullable(),
    }),
  ),
  getShippingPolicyZoneId: z.string().optional(),
})

export async function updateTier(input: z.infer<typeof updateTierSchema>) {
  console.log(input.price)
  return await prisma.shippingPolicyZone.update({
    where: {
      id: input.id,
      ShippingPolicy: {
        environmentId: (await auth()).user.selectedEnvironmentId,
      },
    },
    data: {
      price: input.price ?? undefined,
      each_additional: input.each_additional ?? undefined,
      currencyId: input.currencyId ?? undefined,
      countries: {
        connect: input.countries.map((country) => ({
          id: country.id,
        })),
      },
    },
    include: {
      currency: true,
    },
  })
}

export const updateShippingPolicySchema = z.object({
  id: z.string(),
  name: z.string().optional(),
})
export async function updateShippingPolicy(input: z.infer<typeof updateShippingPolicySchema>) {
  const shippingPolicy = await getShippingPolicy(input.id)
  if (!shippingPolicy) throw new Error("ShippingPolicy not found")

  return await prisma.shippingPolicy.update({
    where: {
      id: input.id,
    },
    data: {
      name: input.name ?? undefined,
    },
    include: {},
  })
}

export const deleteShippingPolicyTier = async (tierId: string) => {
  return await prisma.shippingPolicyZone.delete({
    where: {
      id: tierId,
      ShippingPolicy: {
        environmentId: (await auth()).user.selectedEnvironmentId,
      },
    },
  })
}
export const deleteShippingPolicy = async (shippingPolicyId: string) => {
  return await prisma.$transaction([
    // Also delete the shipping policy tiers
    prisma.shippingPolicyZone.deleteMany({
      where: {
        shippingPolicyId,
      },
    }),
    prisma.shippingPolicy.delete({
      where: {
        id: shippingPolicyId,
        environmentId: (await auth()).user.selectedEnvironmentId,
      },
    }),
  ])
}

export const createShippingPolicyZone = async (shippingPolicyId: string) => {
  return await prisma.shippingPolicyZone.create({
    data: {
      ShippingPolicy: {
        connect: {
          id: shippingPolicyId,
        },
      },
      currency: {
        connect: {
          id: (await listCurrenciesIncludingFiat())[0].id,
        },
      },
    },
  })
}
