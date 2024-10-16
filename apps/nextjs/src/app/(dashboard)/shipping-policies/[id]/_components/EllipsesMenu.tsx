"use client"

import React from "react"
import { DeleteModal } from "@acme/ui"
import { EllipsesMenuTrigger } from "@acme/ui/Menu"
import { Dialog, DropdownMenu } from "@radix-ui/themes"

import { deleteShippingPolicyTierAction } from "~/_actions/shippingPolicies"

export function EllipsesMenu({ tierId }: { tierId: string }) {
  return (
    <Dialog.Root>
      <DropdownMenu.Root modal={false}>
        <DropdownMenu.Trigger>
          <EllipsesMenuTrigger />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DeleteItem tierId={tierId} />
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Dialog.Root>
  )
}

export function DeleteItem({ tierId }: { tierId: string }) {
  const [open, setOpen] = React.useState(false)
  const deleteShippingPolicyTierActionWithId = deleteShippingPolicyTierAction.bind(null, { tierId })

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
      <DeleteModal open={open} setOpen={setOpen} deleteAction={deleteShippingPolicyTierActionWithId} modelName="Shipping Zone" />
    </>
  )
}
