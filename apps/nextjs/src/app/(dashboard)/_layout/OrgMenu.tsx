"use client"

import React from "react"
import type { Organization } from "@acme/db"
import { cn } from "@acme/shadcn/utils/cn"
import { CircleImageIcon } from "@acme/ui/List/[id]/CircleImageIcon"
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons"
import * as Select from "@radix-ui/react-select"
import { HiChevronUpDown } from "react-icons/hi2"

import { addOrganizationAction, changeOrganizationAction } from "~/_actions/organizations"

export default function OrgMenuComponent({ currentOrganizationId, organizations, className }: { currentOrganizationId: string; organizations: Organization[]; className?: string }) {
  return (
    <Select.Root
      value={currentOrganizationId}
      onValueChange={async (e) => e === "new" ? await addOrganizationAction() : await changeOrganizationAction({ organizationId: e })}
    >
      <Select.Trigger
        className={cn(className,"space-between flex max-w-[15rem] flex-row items-center justify-between gap-[5px] rounded bg-slate-1 text-sm font-normal leading-none outline-none hover:bg-slate-2 focus:outline-none focus:ring-2 focus:ring-indigo-9")}
        aria-label="Organization"
      >
        <div className="block w-[90%]">
          <Select.Value />
        </div>
        <div>
          <Select.Icon className="text-slate-10 dark:text-indigo-11">
            <HiChevronUpDown size="20" />
          </Select.Icon>
        </div>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          position="popper"
          className="z-[9999] overflow-hidden rounded-md border border-slate-4 bg-slate-1 p-1 shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]"
        >
          <Select.ScrollUpButton className="flex h-[25px] cursor-default items-center justify-center bg-slate-1 text-indigo-11">
            <ChevronUpIcon />
          </Select.ScrollUpButton>
          <Select.Viewport className="p-[5px]">
            <Select.Group>
              {organizations.map((organization) => (
                <SelectItem key={organization.id} organization={organization} />
              ))}
            </Select.Group>
            <Select.Group>
              <Select.Item
                className=" relative flex select-none items-center rounded-[3px] px-4 text-sm font-normal leading-none text-slate-12 data-[disabled]:pointer-events-none data-[highlighted]:bg-indigo-4 data-[disabled]:text-slate-8 data-[highlighted]:outline-none"
                value="new"
              >
                <NewOrgItem />
              </Select.Item>
            </Select.Group>
          </Select.Viewport>
          <Select.ScrollDownButton className="flex h-[25px] cursor-default items-center justify-center bg-slate-1 text-indigo-11">
            <ChevronDownIcon />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}

const SelectItem = React.forwardRef(
  (
    {
      organization,
      className,
      ...props
    }: {
      organization: Organization
      className?: string
    },
    forwardedRef,
  ) => {
    return (
      <Select.Item
        className={cn(
          "relative flex  select-none items-center rounded-[3px] px-4 text-sm font-normal leading-none text-slate-12 data-[disabled]:pointer-events-none data-[highlighted]:bg-indigo-4 data-[disabled]:text-slate-8 data-[highlighted]:outline-none",
          className,
        )}
        {...props}
        ref={forwardedRef}
        value={organization.id}
      >
        <Select.ItemText
          style={{
            width: "-webkit-fill-available !important",
          }}
        >
          <span className="flex min-w-0 flex-row  items-center space-x-3 py-2">
            <CircleImageIcon image={organization.image} alt={organization.name} size={8} fallbackIcon="UserGroupIcon" />
            <span className="truncate">{organization.name}</span>
          </span>
        </Select.ItemText>
      </Select.Item>
    )
  },
)
SelectItem.displayName = "SelectItem"

const NewOrgItem = React.forwardRef(({}, forwardedRef) => {
  return (
    <span className="flex min-w-0 items-center justify-between space-x-3 py-2">
      <CircleImageIcon size={8} fallbackIcon="PlusIcon" />
      <Select.ItemText>New Organization</Select.ItemText>
    </span>
  )
})
NewOrgItem.displayName = "NewOrgItem"
