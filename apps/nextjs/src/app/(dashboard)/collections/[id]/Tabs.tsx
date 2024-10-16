"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Tabs } from "@radix-ui/themes"

export default function PageTabs({ id }: { id: string }) {
  const pathname = usePathname()
  const initialTab = pathname.split(id).pop()?.split("/").pop()
  const [activeTab, setActiveTab] = React.useState<string | undefined>(initialTab ?? "collection")

  React.useEffect(() => {
    setActiveTab(pathname.split("/")[3] || "collection")
  }, [pathname])

  return (
    <Tabs.Root defaultValue="collection" value={activeTab}>
      <Tabs.List>
        <Tabs.Trigger value="collection">
          <Link href={`/collections/${id}`}>Collection</Link>
        </Tabs.Trigger>
        <Tabs.Trigger value="variants">
          <Link href={`/collections/${id}/variants`}>Variants</Link>
        </Tabs.Trigger>
        <Tabs.Trigger value="payments">
          <Link href={`/collections/${id}/payments`}>Payments</Link>
        </Tabs.Trigger>
      </Tabs.List>
    </Tabs.Root>
  )
}
