import { Suspense } from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import BackArrow from "@acme/ui/BackArrow"
import Loading from "@acme/ui/loading"
import { Flex } from "@radix-ui/themes"

import { getNotificationSource } from "~/_backend/notificationSources"
import { auth } from "~/utils/auth"
import PageHeader from "./_components/Header"
import NotificationsTable from "./_components/NotificationsTable"
import InformationPanel from "./_components/sections/InformationPanel"

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const session = await auth()
  const notificationSource = await getNotificationSource(params.id, session.user.selectedEnvironmentId)
  if (!notificationSource) return redirect(`/notification-sources`)
  return {
    title: "" + (notificationSource.name ?? params.id),
  }
}

export default function Page({ params }: { params: { id: string } }) {
  return (
    <Flex direction="column" gap="6" className="h-full">
      <BackArrow text="Notifications" href="/notification-sources" />
      <Suspense>
        <PageHeader id={params.id} />
      </Suspense>
      <Suspense fallback={<Loading />}>
        <InformationPanel id={params.id} />
      </Suspense>
      <Suspense fallback={<Loading />}>
        <NotificationsTable id={params.id} />
      </Suspense>
    </Flex>
  )
}
