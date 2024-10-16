"use client"

import Link from "next/link"
import { cn } from "@acme/shadcn/utils/cn"

export function HoverCard({ children, variant, onClick, href }: { children: React.ReactNode; variant?: "active"; onClick?: () => void; href: string }) {
  return (
    <div className={cn("box-border  ")}>
      <Link
        className={cn(
          "relative block rounded-[8px] transition-all ",
          "hover:translate-y-[-2px] hover:!bg-panel hover:before:shadow-[0px_10px_38px_-10px_rgba(22,23,24,0.35),_0px_10px_20px_-15px_rgba(22,23,24,0.2)]  hover:before:content-[''] ",
          variant === "active" &&
            "!bg-panel before:shadow-[0px_10px_38px_-10px_rgba(22,23,24,0.35),_0px_10px_20px_-15px_rgba(22,23,24,0.2)]  before:content-[''] ",
          "before:absolute before:bottom-0 before:left-0 before:right-0 before:top-0 before:rounded-[8px]",
          "focus:transform-[translateY(-2px)] focus:bg-panel focus:shadow-[inset_0_0_0_1px_#0954a5,_0_0_0_1px_#0954a5]", // focus
        )}
        style={{ padding: "20px" }}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          if (onClick) {
            onClick()
          }
        }}
      >
        {children}
      </Link>
    </div>
  )
}
