import { z } from "zod"

export const addressSchema = {
  firstName: z.string(),
  lastName: z.string(),
  addressLine1: z.string(),
  addressLine2: z.string().optional(),
  city: z.string(),
  StateProvinceCounty: z.string(),
  ZipOrPostcode: z.string(),
  country: z.string(),
}
