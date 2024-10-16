import { redirect } from "next/navigation"
import { cn } from "@acme/shadcn/utils/cn"
import { Flex } from "@radix-ui/themes"

// @ts-expect-error cjs
import { env } from "~/env.ts"
import { auth } from "~/utils/auth"
import Header from "./_layout/Header/Header"
import Sidebar from "./_layout/Sidebar/Sidebar"
import SidebarWrapper from "./_layout/Sidebar/SidebarWrapper"

export const metadata: Metadata = {
  title: {
    template: "Supra | %s",
    default: "Supra", // a default is required when creating a template
  },
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) return redirect(`${env.NEXT_PUBLIC_HOMEPAGE_URL}/login`)

  const panelBackgound = "bg-white dark:bg-slate-1"

  return (
    <Flex direction="column" className="min-h-screen">
      <Header className={cn("h-16", panelBackgound)} sidebarWidth="w-72" />
      <Flex align="stretch" className="flex-1">
        <Flex width="100%">
          <Sidebar className={cn("invisible top-16 w-72 xl:visible", panelBackgound)} />
          <SidebarWrapper>
            <Sidebar className={cn("top-0 w-72 xl:visible", panelBackgound)} />
          </SidebarWrapper>
          <div className="flex w-full flex-col pt-16 xl:pl-72">
            <main className="flex min-h-full w-full flex-col p-4 md:p-8">{children}</main>
          </div>
        </Flex>
      </Flex>
    </Flex>
  )
}
