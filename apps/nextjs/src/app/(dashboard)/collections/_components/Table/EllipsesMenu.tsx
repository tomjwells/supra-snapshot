"use client"

import React from "react"
import { EllipsesMenuTrigger } from "@acme/ui/Menu"
import { DropdownMenu } from "@radix-ui/themes"
import { toast } from "sonner"

import { archiveCollectionAction } from "~/_actions/collections"

export function EllipsesMenu({ collectionId }: { collectionId: string }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <EllipsesMenuTrigger />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item
          color="red"
          onClick={async () => {
            const archivedCollection = await archiveCollectionAction({ collectionId })
            if (archivedCollection) {
              toast.success("Archived")
            }
          }}
        >
          Archive
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
