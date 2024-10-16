"use client"

import React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Box, Flex, Tabs, Text } from "@radix-ui/themes"

export default function PageTabs() {
  const router = useRouter()
  const pathname = usePathname()

  const [activeTab, setActiveTab] = React.useState<string | undefined>(pathname.split("/").pop() ?? "events")
  React.useEffect(() => {
    console.log({ useEff: pathname.split("/").pop() || "events" })
    setActiveTab(pathname.split("/").pop() || "events")
  }, [pathname])

  return (
    <Tabs.Root value={activeTab}>
      <Tabs.List>
        <Tabs.Trigger value="events">
          <Link href={`events`}>Events</Link>
        </Tabs.Trigger>
        <Tabs.Trigger value="settings">
          <Link href={`settings`}>Settings</Link>
        </Tabs.Trigger>
      </Tabs.List>
    </Tabs.Root>
  )
}
