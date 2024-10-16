"use client"

import React from "react"
import { EllipsesMenuTrigger } from "@acme/ui"
import { AlertDialog, Button, DropdownMenu, Flex } from "@radix-ui/themes"

import { deleteVariantAction } from "~/_actions/variants"

export default function EllipsesMenu({ variantId }: { variantId: string }) {
  const [open, setOpen] = React.useState(false)

  return (
    <AlertDialog.Root open={open} onOpenChange={() => setOpen((open) => !open)}>
      <DropdownMenu.Root onOpenChange={() => setOpen(false)}>
        <DropdownMenu.Trigger>
          <EllipsesMenuTrigger />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <AlertDialog.Trigger>
            <DropdownMenu.Item
              color="red"
              onClick={(e) => {
                e.preventDefault()
                setOpen(true)
              }}
            >
              Delete
            </DropdownMenu.Item>
          </AlertDialog.Trigger>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      <AlertDialog.Content style={{ maxWidth: 450 }} onAbort={() => setOpen(false)}>
        <AlertDialog.Title>Delete Variant</AlertDialog.Title>
        <AlertDialog.Description size="2">This will delete the selected variant from the collection. Do you wish to continue?</AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button variant="solid" color="blue" onClick={() => deleteVariantAction({ variantId })}>
              Continue
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}
