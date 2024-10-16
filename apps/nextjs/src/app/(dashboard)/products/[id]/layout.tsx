import { Suspense } from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { cloudinaryImageSrc } from "@acme/cloudinary/cloudinary-client"
import { Flex } from "@radix-ui/themes"

import { getProduct } from "~/_backend/products"

import "@radix-ui/themes"

import Loading from "@acme/ui/loading"

import PageHeader from "./_components/PageHeader"
import Tabs from "./Tabs"

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
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
      <Tabs id={params.id} />
      <Suspense fallback={<Loading />}>
        <PageHeader id={params.id} />
      </Suspense>

      {children}
    </Flex>
  )
}
