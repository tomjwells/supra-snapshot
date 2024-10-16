import { Suspense } from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Loading from "@acme/ui/loading"
import { Flex } from "@radix-ui/themes"

import { listByCollectionId } from "~/_backend/checkoutLinks"
import { getCollection } from "~/_backend/collections"
import { getEnvironment } from "~/_backend/environments"
import { getOrganization } from "~/_backend/organizations"
import CheckoutLinks from "~/app/(dashboard)/_checkout-links/CheckoutLinks"
import Attributes from "./_components/sections/Attributes"
import InformationPanel from "./_components/sections/InformationPanel"

export const runtime = "nodejs"

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const collection = await getCollection(params.id)
  try {
    if (!collection) redirect(`/collections`)
    return {
      title: collection.name || collection.id,
    }
  } catch (e) {
    console.log(e)
    return {}
  }
}

export default async function Page({ params: { id } }: { params: { id: string } }) {
  const collection = await getCollection(id)
  try {
    if (!collection) redirect(`/collections`)
  } catch (e) {
    console.log(e)
  }
  return (
    <Flex direction="column" gap="6" className="h-full">
      <Suspense fallback={<Loading />}>
        <InformationPanel collection={collection} />
      </Suspense>
      <Suspense>
        <Attributes collection={collection} />
      </Suspense>
      <Suspense>
        <CheckoutLinks
          environment={await getEnvironment()}
          organization={await getOrganization()}
          checkoutLinks={await listByCollectionId(id)}
          collectionId={id}
        />
      </Suspense>
    </Flex>
  )
}
