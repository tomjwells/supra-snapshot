"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

import { createProduct, deleteProduct, duplicateProduct, updateProduct, updateProductSchema } from "~/_backend/products"

export async function createProductAction() {
  redirect(`/products/${(await createProduct()).id}`)
}

export async function updateProductAction(input: z.infer<typeof updateProductSchema>) {
  const data = updateProductSchema.parse(input)
  const product = await updateProduct(data)
  revalidatePath("/")
  return product
}

export async function deleteProductAction(input: { productId: string }) {
  const data = z
    .object({
      productId: z.string(),
    })
    .parse(input)
  const deletedProduct = await deleteProduct(data.productId)
  revalidatePath("/")
  return deletedProduct
}

export async function duplicateProductAction(input: { productId: string }) {
  const data = z
    .object({
      productId: z.string(),
    })
    .parse(input)
  const duplicatedProduct = await duplicateProduct(data.productId)
  revalidatePath("/")
  return duplicatedProduct
}
