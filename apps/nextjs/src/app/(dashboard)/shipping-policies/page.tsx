import { Suspense } from "react"
import { redirect } from "next/navigation"
import NewResourceActionButton from "@acme/ui/Buttons/NewResourceActionButton"
import Loading from "@acme/ui/loading"
import PageHeader from "@acme/ui/PageHeader"
import { Flex } from "@radix-ui/themes"

import { createShippingPolicy } from "~/_backend/shippingPolicies"
import { ShippingPoliciesTable } from "./_components/Table/ShippingPoliciesTable"

export const runtime = "nodejs"

export const metadata = {
  title: "Shipping Policies",
}

export default function Page() {
  return (
    <Flex direction="column" gap="6" className="h-full">
      <PageHeader
        title="Shipping Policies"
        RightComponent={
          <form
            action={async () => {
              "use server"
              redirect(`/shipping-policies/${(await createShippingPolicy()).id}`)
            }}
          >
            <NewResourceActionButton resource="Shipping Policy" />
          </form>
        }
      />
      <Suspense fallback={<Loading />}>
        <ShippingPoliciesTable />
      </Suspense>
    </Flex>
  )
}
