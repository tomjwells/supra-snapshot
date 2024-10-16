import { Suspense } from "react"
import type { Metadata } from "next"
import PageHeader from "@acme/ui/PageHeader"

import { SidebarNav } from "./_components/SidebarNav"

export const runtime = "nodejs"

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account settings and organization information.",
}

const sidebarNavItems = [
  {
    title: "Organization",
    href: "/settings",
  },
  {
    title: "Appearance",
    href: "/settings/appearance",
  },
  {
    title: "Plan",
    href: "/settings/plan",
  },
  {
    title: "User",
    href: "/settings/user",
  },
]

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="space-y-6">
      <Suspense>
        <PageHeader title="Settings" subtitle="Manage your account settings and organization information." />
      </Suspense>
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 w-[230px]">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </div>
  )
}
