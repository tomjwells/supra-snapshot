import Link from "next/link"
import { prisma } from "@acme/db"
import { CircleImageIcon } from "@acme/ui/List/[id]/CircleImageIcon"

import { getProduct } from "~/_backend/products"

export default async function ProductField({ productId }: { productId: string }) {
  const product = await getProduct(productId)
  const variant = await prisma.variant.findFirst({
    where: {
      product: {
        id: productId,
      },
    },
  })
  if (!product) return null
  console.log({ variant })
  return (
    <Link href={variant ? `/collections/${variant.collectionId}/variants/${variant.id}` : `/products/${product.id}`}>
      <div className="flex items-center">
        <CircleImageIcon image={product.image} alt={product.name} style="square" fallbackIcon={"CubeIcon"} size={24} />
        <div className="ml-4">
          <div className="font-medium text-slate-12">{product.name}</div>
        </div>
      </div>
    </Link>
  )
}
