"use client"

import { NewResourceButton } from "@acme/ui/Buttons"

import { useCreateNotificationSource } from "~/app/(dashboard)/notification-sources/hooks"

export default function NewNotificationSourceButton() {
  const { mutate } = useCreateNotificationSource()

  return (
    <div className="mt-4 flex md:ml-4 md:mt-0">
      <NewResourceButton resource="Notification Source" onClick={() => mutate()} />
    </div>
  )
}
