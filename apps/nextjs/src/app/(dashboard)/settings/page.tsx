import { Suspense } from "react"
import { revalidatePath } from "next/cache"
import Loading from "@acme/ui/loading"
import { Flex } from "@radix-ui/themes"
import type { z } from "zod"

import { getOrganization, updateOrganization, updateOrganizationSchema } from "~/_backend/organizations"
import OrganizationInformation from "./profile-form"

export default async function Page() {
  const organization = await getOrganization()
  return (
    <Flex direction="column" gap="6" className="h-full">
      <Suspense fallback={<Loading />}>
        <OrganizationInformation
          organization={organization}
          updateOrganizationAction={async (input: z.infer<typeof updateOrganizationSchema>) => {
            "use server"
            const data = updateOrganizationSchema.parse(input)
            const organization = await updateOrganization(data)
            revalidatePath("/")
            return organization
          }}
        />
      </Suspense>
    </Flex>
  )
}
