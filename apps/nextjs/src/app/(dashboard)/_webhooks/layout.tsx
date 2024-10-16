import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { cloudinaryImageSrc } from "@acme/cloudinary/cloudinary-client"
import { Flex } from "@radix-ui/themes"

import { getProduct } from "~/_backend/products"
import { auth } from "~/utils/auth"

import "@radix-ui/themes"

import Tabs from "./Tabs"

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const session = await auth()
  if (!session) return {}
  const product = await getProduct(params.id)
  if (!product) return redirect(`/products`)
  return {
    title: "" + (product.name ?? product.id),
    openGraph: {
      images: [cloudinaryImageSrc(product.image ?? "")],
    },
  }
}

export default function Page({ params, children }: { params: { id: string }; children: React.ReactNode }) {
  return (
    <Flex direction="column" gap="6" className="h-full">
      <Tabs />
      {children}
    </Flex>
  )
}
