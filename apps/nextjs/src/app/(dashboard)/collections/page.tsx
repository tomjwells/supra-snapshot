import { Suspense } from "react"
import { redirect } from "next/navigation"
import NewResourceActionButton from "@acme/ui/Buttons/NewResourceActionButton"
import PageHeader from "@acme/ui/PageHeader"
import { Flex } from "@radix-ui/themes"

import { createCollection } from "~/_backend/collections"
import { auth } from "~/utils/auth"
import CollectionsTable from "./_components/Table"

export const runtime = "nodejs"

export const metadata = {
  title: "Collections",
}

export default function Page() {
  return (
    <Flex direction="column" gap="6" className="h-full">
      <PageHeader
        title="Collections"
        subtitle="Collections are a way to group related products and create variants."
        RightComponent={
          <form
            action={async () => {
              "use server"
              const collection = await createCollection((await auth()).user.selectedEnvironmentId)
              redirect(`/collections/${collection.id}`)
            }}
          >
            <NewResourceActionButton resource="Collection" />
          </form>
        }
      />
      <Suspense>
        <CollectionsTable />
      </Suspense>
    </Flex>
  )
}
