"use client"

import PageHeader from "@acme/ui/PageHeader"

import { ButtonGroup } from "./ButtonGroup"

export default function Header({ id }: { id: string }) {
  const [notificationSource, _query] = api.notificationSources.get.useSuspenseQuery({ id })

  return (
    <PageHeader
      title={notificationSource.name ?? notificationSource.id}
      RightComponent={<ButtonGroup id={notificationSource.id} status={notificationSource.status} />}
    />
  )
}
