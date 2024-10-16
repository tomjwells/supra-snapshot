import { Suspense } from "react"
import { revalidatePath } from "next/cache"
import Loading from "@acme/ui/loading"
import { Flex } from "@radix-ui/themes"
import type { z } from "zod"

import { getUser, updateUser, updateUserSchema } from "~/_backend/users"
import UserInformation from "./user-form"

export default async function Page() {
  const user = await getUser()
  return (
    <Flex direction="column" gap="6" className="h-full">
      <Suspense fallback={<Loading />}>
        <UserInformation
          user={user}
          updateUserAction={async (input: z.infer<typeof updateUserSchema>) => {
            "use server"
            const data = updateUserSchema.parse(input)
            const user = await updateUser(data)
            revalidatePath("/")
            return user
          }}
        />
      </Suspense>
    </Flex>
  )
}
