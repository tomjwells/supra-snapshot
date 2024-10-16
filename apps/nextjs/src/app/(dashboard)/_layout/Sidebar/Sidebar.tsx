import { Suspense } from "react"
import { signOut } from "@acme/auth"
import { cloudinaryImageSrc } from "@acme/cloudinary/cloudinary-client"
import { cn } from "@acme/shadcn/utils/cn"
import { UserIcon } from "@heroicons/react/24/outline"
import { Avatar, Flex } from "@radix-ui/themes"

import { listEnvironments } from "~/_backend/environments"
import { listOrganizations } from "~/_backend/organizations"
// @ts-expect-error cjs
import { env } from "~/env.ts"
import { auth } from "~/utils/auth"
import { EnvironmentMenuComponent } from "../EnvironmentMenu"
import OrgMenuComponent from "../OrgMenu"
import SidebarNav from "./SidebarNav"
import UserMenu from "./UserMenu"

export default async function Sidebar({ className }: { className?: string }) {
  return (
    <Flex direction="column" gap="5" asChild p="3" className={cn(className ?? "", "fixed bottom-0 left-0    ring-1 ring-slate-4")}>
      <nav>
        <span className="mb-2 mt-4 flex w-full flex-row justify-center sm:hidden">
          <Suspense>
            <OrgMenuComponent currentOrganizationId={(await auth()).user.selectedOrganizationId} organizations={await listOrganizations()} />
          </Suspense>
        </span>
        <span className="mb-2 mt-4">
          <Suspense>
            <EnvironmentMenuComponent selectedEnvironmentId={(await auth()).user.selectedEnvironmentId} environments={await listEnvironments()} />
          </Suspense>
        </span>

        <SidebarNav />

        <Suspense>
          <UserMenu
            trigger={
              <button className="flex items-center gap-x-4 px-6  py-3 text-sm font-semibold leading-6 text-slate-12 hover:bg-theme-btn-inverted">
                <Avatar src={cloudinaryImageSrc((await auth()).user.image ?? "")} fallback={<UserIcon className="h-8 w-8" />} radius="full" size="2" />
                <span className="sr-only">Your profile</span>
                <span aria-hidden="true">{(await auth()).user.name}</span>
              </button>
            }
            signOutButton={
              <form
                action={async () => {
                  "use server"
                  await signOut({ redirectTo: env.NEXT_PUBLIC_HOMEPAGE_URL + "/login" })
                }}
              >
                <button className="flex min-w-[200px] items-start">Sign out</button>
              </form>
            }
            email={(await auth()).user.email ?? (await auth()).user.name}
          />
        </Suspense>
      </nav>
    </Flex>
  )
}
