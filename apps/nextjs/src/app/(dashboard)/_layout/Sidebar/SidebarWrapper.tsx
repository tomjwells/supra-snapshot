"use client"

import React from "react"
import { Sheet, SheetContent, SheetTrigger } from "@acme/shadcn/sheet"
import { Bars3Icon } from "@heroicons/react/20/solid"
import { Theme } from "@radix-ui/themes"

export default function SidebarWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Sheet>
      <div className="fixed left-4 top-5 z-50 ">
        <SheetTrigger type="button" className="-m-2.5 p-2.5 text-slate-12 xl:invisible">
          <Bars3Icon className="h-5 w-5" aria-hidden="true" />
        </SheetTrigger>
      </div>
      <SheetContent className="relative mr-16 flex w-full max-w-xs flex-1">
        <Theme>{children}</Theme>
      </SheetContent>
    </Sheet>
  )
}
