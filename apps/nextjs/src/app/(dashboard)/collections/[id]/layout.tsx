import { Suspense } from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Loading from "@acme/ui/loading"
import { Flex } from "@radix-ui/themes"

import { getCollection } from "~/_backend/collections"
import PageHeader from "./_components/PageHeader"
import Tabs from "./Tabs"

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const collection = await getCollection(params.id)
  if (!collection) return redirect(`/collections`)
  return {
    title: collection.name ?? collection.id,
  }
}

export default async function Page({ params, children }: { params: { id: string }; children: React.ReactNode }) {
  const collection = await getCollection(params.id)

  return (
    <Flex direction="column" gap="6" className="h-full">
      <Suspense fallback={<Loading />}>
        <PageHeader collection={collection} />
      </Suspense>

      <Tabs id={params.id} />
      {children}
    </Flex>
  )
}
