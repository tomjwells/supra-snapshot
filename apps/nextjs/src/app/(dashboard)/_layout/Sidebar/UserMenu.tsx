"use client"

import Link from "next/link"
import { DropdownMenu, Flex } from "@radix-ui/themes"

export default function UserMenu({
  trigger,
  signOutButton,
  email,
}: {
  trigger: React.ReactNode
  signOutButton: React.ReactNode
  email: string | null | undefined
}) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>{trigger}</DropdownMenu.Trigger>
      <DropdownMenu.Content color="indigo" className="!z-50">
        {email && (
          <Flex direction="column" className=" !items-start !px-3 !py-2">
            <p className="text-sm">Signed in as</p>
            <p className="truncate text-sm font-medium text-slate-12">{email}</p>
          </Flex>
        )}
        <Link href="/settings">
          <DropdownMenu.Item>Settings</DropdownMenu.Item>
        </Link>
        <DropdownMenu.Separator />
        <Link href="https://docs.suprapayments.io" target="_blank">
          <DropdownMenu.Item>Documentation</DropdownMenu.Item>
        </Link>
        <Link href="https://discord.gg/3MawVjc8" target="_blank">
          <DropdownMenu.Item>Feedback</DropdownMenu.Item>
        </Link>

        <DropdownMenu.Separator />
        <DropdownMenu.Item>{signOutButton}</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
