import { getVariant } from "~/_backend/variants"
import ProductPage from "~/app/(dashboard)/products/[id]/page"

export const runtime = "nodejs"

export default async function Page({ params: { variantId } }: { params: { variantId: string } }) {
  const variant = await getVariant(variantId)
  if (!variant?.product) return null
  return <ProductPage params={{ id: variant.product.id }} />
}
