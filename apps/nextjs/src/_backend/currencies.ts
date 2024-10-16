import { cache } from "react"
import { CurrencyType, prisma } from "@acme/db"

export type CurrenciesType = Awaited<ReturnType<typeof listCurrencies>>

export const listCurrencies = cache(async () =>
  prisma.currencies.findMany({
    where: {
      enabled: true,
      type: CurrencyType.CRYPTO,
    },
    orderBy: {
      orderIndex: "asc",
    },
  }),
)

export const listCurrenciesIncludingFiat = cache(async () =>
  prisma.currencies.findMany({
    where: {
      enabled: true,
    },
    orderBy: {
      orderIndex: "asc",
    },
  }),
)
