import { Suspense } from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import PageHeader from "@acme/ui/PageHeader"
import { Flex } from "@radix-ui/themes"

import { getNotificationSource } from "~/_backend/notificationSources"
import { auth } from "~/utils/auth"
import { EllipsesMenu } from "./_components/EllipsesMenu"
import NotificationsTable from "./_components/NotificationsTable"
import InformationPanel from "./_components/sections/InformationPanel"

export const runtime = "nodejs"
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const notificationSource = await getNotificationSource(params.id, (await auth()).user.selectedEnvironmentId)
  if (!notificationSource) return redirect(`/notification-sources`)
  return {
    title: "" + (notificationSource.name ?? params.id),
  }
}

export default async function Page({ params }: { params: { id: string } }) {
  const notificationSource = await getNotificationSource(params.id, (await auth()).user.selectedEnvironmentId)
  if (!notificationSource) return redirect(`/notification-sources`)

  return (
    <Flex direction="column" gap="6" className="h-full">
      <PageHeader title={notificationSource.name ?? notificationSource.id} RightComponent={<EllipsesMenu notificationSourceId={notificationSource.id} />} />
      <Suspense>
        <InformationPanel notificationSource={notificationSource} />
      </Suspense>
      <Suspense>
        <NotificationsTable id={params.id} />
      </Suspense>
    </Flex>
  )
}
