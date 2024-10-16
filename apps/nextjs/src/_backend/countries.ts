import { cache } from "react"
import { prisma } from "@acme/db"

export type CountriesType = Awaited<ReturnType<typeof listCountries>>

export const listCountries = cache(async () => {
  return prisma.country.findMany({
    orderBy: {
      name: "asc",
    },
  })
})
