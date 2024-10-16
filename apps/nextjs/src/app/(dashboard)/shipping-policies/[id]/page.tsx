import { Suspense } from "react"
import { redirect } from "next/navigation"
import Loading from "@acme/ui/loading"
import PageHeader from "@acme/ui/PageHeader"
import { Flex } from "@radix-ui/themes"

import { getShippingPolicy } from "~/_backend/shippingPolicies"
import InformationPanel from "./_components/InformationPanel"
import TiersPanel from "./_components/TiersPanel"

export const runtime = "nodejs"

interface Props {
  params: { id: string }
  searchParams: Record<string, string | string[] | undefined>
}

export function generateMetadata({ params }: Props) {
  return {
    title: "Shipping Policy " + params.id,
  }
}

export default async function Page({ params: { id } }: { params: { id: string } }) {
  const shippingPolicy = await getShippingPolicy(id)
  if (!shippingPolicy) redirect("/shipping-policies")

  return (
    <Flex direction="column" gap="6" className="h-full">
      <PageHeader title={shippingPolicy.name} />
      <Suspense fallback={<Loading />}>
        <InformationPanel shippingPolicy={shippingPolicy} />
        <TiersPanel shippingPolicy={shippingPolicy} />
      </Suspense>
      {/*
      <Suspense fallback={<Loading />}>
        <CustomerInformation id={id} />
      </Suspense> */}
    </Flex>
  )
}
