"use client"

import React from "react"
import type { Environment } from "@acme/db"
import { Select } from "@radix-ui/themes"

import { changeEnvironmentAction } from "~/_actions/environments"

export function EnvironmentMenuComponent({ selectedEnvironmentId, environments }: { selectedEnvironmentId: string; environments: Environment[] }) {
  return (
    <Select.Root
      size="2"
      value={selectedEnvironmentId}
      onValueChange={(environmentId) => changeEnvironmentAction(environmentId)}
    >
      <Select.Trigger variant="surface" className="!w-full text-slate-12" />
      <Select.Content position="popper" className="z-[9999]">
        {environments && environments.length > 0 && (
          <Select.Group>
            {environments.map((environment) => (
              <Select.Item key={environment.id} value={environment.id}>
                {environment.name}
              </Select.Item>
            ))}
          </Select.Group>
        )}
      </Select.Content>
    </Select.Root>
  )
}
