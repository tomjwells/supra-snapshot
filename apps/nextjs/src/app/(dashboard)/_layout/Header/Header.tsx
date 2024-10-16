import React, { Suspense } from "react"
import { cn } from "@acme/shadcn/utils/cn"

import { listOrganizations } from "~/_backend/organizations"
import { auth } from "~/utils/auth"
import OrgMenuComponent from "../OrgMenu"

export default async function Header({ className, sidebarWidth }: { className?: string; sidebarWidth: string }) {
  return (
    <header className={cn(className, "fixed top-0 z-40 flex w-screen shrink-0 items-center gap-x-6 border-b border-slate-4")}>
      <span className="hidden px-12 sm:block xl:px-6">
        <Suspense>
          <OrgMenuComponent currentOrganizationId={(await auth()).user.selectedOrganizationId} organizations={await listOrganizations()} className={sidebarWidth} />
        </Suspense>
      </span>

      <div className="flex flex-1 items-center gap-x-4 self-stretch lg:gap-x-6">
        <span className="flex flex-1" />
      </div>
    </header>
  )
}
