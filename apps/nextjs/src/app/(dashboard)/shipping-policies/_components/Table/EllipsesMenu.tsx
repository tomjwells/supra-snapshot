"use client"

import React from "react"
import { EllipsesMenuTrigger } from "@acme/ui/Menu"
import { DropdownMenu } from "@radix-ui/themes"

import { deleteShippingPolicyAction, duplicateShippingPolicyAction } from "~/_actions/shippingPolicies"

export function EllipsesMenu({ shippingPolicyId }: { shippingPolicyId: string }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <EllipsesMenuTrigger />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item onClick={() => duplicateShippingPolicyAction({ shippingPolicyId })}>Duplicate</DropdownMenu.Item>
        <DropdownMenu.Item color="red" onClick={() => deleteShippingPolicyAction({ shippingPolicyId })}>
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
