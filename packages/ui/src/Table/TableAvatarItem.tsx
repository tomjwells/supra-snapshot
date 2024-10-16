import type { Product } from "@acme/db"
import { cn } from "@acme/shadcn"

import { CircleImageIcon } from "../List/[id]/CircleImageIcon"

export function ProductAvatarItem({ product, size }: { product: Product; size?: number }) {
  if (!product) return null // I could make a skeleton here
  return <TableAvatarItem image={product.image ?? ""} alt={product.name ?? ""} title={product.name ?? "Unnamed product"} size={size} />
}

export default function TableAvatarItem({
  image = "",
  alt = "",
  title = "",
  subtitle,
  size = 11,
}: {
  image?: string
  alt?: string
  title: string
  subtitle?: string
  size?: number
}) {
  return (
    <div className="flex items-center">
      <div className={cn(`h-${size} w-${size}`, " flex-shrink-0")}>
        <CircleImageIcon image={image} alt={alt} size={size ?? 11} fallbackIcon="CubeIcon" />
      </div>
      <div className="ml-4">
        <div className="font-medium text-slate-12">{title}</div>
        {subtitle && <div className="mt-1 text-slate-10">{subtitle}</div>}
      </div>
    </div>
  )
}
