"use client"

import React from "react"
import { DeleteModal } from "@acme/ui"
import { EllipsesMenuTrigger } from "@acme/ui/Menu"
import { Dialog, DropdownMenu } from "@radix-ui/themes"

import { deleteNotificationSourceAction } from "~/_actions/notificationSources"

export function EllipsesMenu({ notificationSourceId }: { notificationSourceId: string }) {
  return (
    <Dialog.Root>
      <DropdownMenu.Root modal={false}>
        <DropdownMenu.Trigger>
          <EllipsesMenuTrigger />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DeleteItem notificationSourceId={notificationSourceId} />
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Dialog.Root>
  )
}

export function DeleteItem({ notificationSourceId }: { notificationSourceId: string }) {
  const [open, setOpen] = React.useState(false)
  const deleteNotificationSourceActionWithId = deleteNotificationSourceAction.bind(null, { id: notificationSourceId })

  return (
    <>
      <Dialog.Trigger>
        <DropdownMenu.Item
          color="red"
          onClick={(e) => {
            setOpen(true)
            e.preventDefault()
          }}
        >
          Delete
        </DropdownMenu.Item>
      </Dialog.Trigger>
      <DeleteModal open={open} setOpen={setOpen} deleteAction={deleteNotificationSourceActionWithId} modelName="Notification Source" />
    </>
  )
}
