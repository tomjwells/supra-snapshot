"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@acme/shadcn/utils/cn"
import { useTheme } from "next-themes"

export default function NavLink({
  item,
}: {
  item: {
    title: string
    href: string
    icon?: React.ReactNode
    prefetch?: () => Promise<void>
  }
}) {
  const pathname = usePathname()

  const isActive = (pathname === "/" && item.href === "/") || (item.href !== "/" && pathname?.startsWith(item.href))
  const { theme } = useTheme()

  const navLinkColorOptions = {
    indigo: "bg-[var(--indigo-2)]",
    linear: "bg-[#f0f3f9]",
    gray1: "bg-[var(--gray-1)]",
    gray2: "bg-[var(--gray-2)]",
    gray3: "bg-[var(--gray-3)]",
  }
  const navLinkHoverColorOptions = {
    indigo: "hover:bg-[var(--indigo-3)]",
    linear: "hover:bg-[#f0f3f9]",
    gray1: "hover:bg-[var(--gray-1)]",
    gray2: "hover:bg-[var(--gray-2)]",
    gray3: "hover:bg-[var(--gray-3)]",
  }

  return (
    <Link
      key={item.href}
      href={item.href}
      onMouseEnter={item.prefetch}
      className={cn(
        "h-[2.18rem] px-4 py-0",
        "focus-visible:ring-ring inline-flex items-center justify-center text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "group flex justify-start gap-x-3",
        "overflow-ellipsis whitespace-nowrap",
        "rounded-[var(--radius-2)]",
        "text-gray-11",
        // hover and isActive should be about the same
        theme === "dark" ? `hover:bg-[hsl(220_13%_12%_/_1)]` : `${navLinkHoverColorOptions["gray2"]}`,
        isActive ? (theme === "dark" ? `${navLinkColorOptions["gray3"]}` : `${navLinkColorOptions["indigo"]}`) : "",
      )}
    >
      {item.icon}
      {item.title}
    </Link>
  )
}
