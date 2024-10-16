import { Suspense } from "react"
import { redirect } from "next/navigation"
import { createNotificationSource } from "@acme/auth/environmentsHelper"
import NewResourceActionButton from "@acme/ui/Buttons/NewResourceActionButton"
import PageHeader from "@acme/ui/PageHeader"
import { Flex } from "@radix-ui/themes"

import { auth } from "~/utils/auth"
import OverviewPanels from "./_components/OverviewPanels"
import NotificationSourcesTable from "./_components/Table"

export const runtime = "nodejs"

export const metadata = {
  title: "Notifications",
}

export default function Page() {
  return (
    <Flex direction="column" gap="6">
      <PageHeader
        title="Notifications"
        RightComponent={
          <form
            action={async () => {
              "use server"
              const notificationSource = await createNotificationSource((await auth()).user.selectedEnvironmentId)
              redirect(`/notification-sources/${notificationSource.id}`)
            }}
          >
            <NewResourceActionButton resource="Notification Source" />
          </form>
        }
      />
      <Suspense>
        <OverviewPanels />
      </Suspense>
      <Suspense>
        <NotificationSourcesTable />
      </Suspense>
    </Flex>
  )
}
