"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Tabs } from "@radix-ui/themes"

export default function PageTabs({ id }: { id: string }) {
  const pathname = usePathname()

  const initialTab = pathname.split(id).pop()?.split("/").pop()
  const [activeTab, setActiveTab] = React.useState<string | undefined>(initialTab ?? "product")

  React.useEffect(() => {
    console.log({ useEff: pathname.split(id).pop()?.split("/").pop() || "product" })
    setActiveTab(pathname.split(id).pop()?.split("/").pop() || "product")
  }, [pathname])

  return (
    <Tabs.Root defaultValue="product" value={activeTab}>
      <Tabs.List>
        <Tabs.Trigger value="product">
          <Link href={`/products/${id}`}>Product</Link>
        </Tabs.Trigger>
        <Tabs.Trigger value="payments">
          <Link href={`/products/${id}/payments`}>Payments</Link>
        </Tabs.Trigger>
      </Tabs.List>
    </Tabs.Root>
  )
}
