import React, { Suspense } from "react"
import { cn } from "@acme/shadcn/utils/cn"
import SupraLogo from "@acme/ui/Brand/SupraLogo"

import { HeaderNavigationMenu } from "./NavigationMenu"
import RightNav, { SignInSignUpButtons } from "./RightNav"

export default function Header() {
  return (
    <>
      <div id="scroll-watcher" data-scroll-watcher />
      <header
        suppressHydrationWarning
        className={cn(
          "flex flex-row justify-center p-5",
          "fixed top-0 z-40 h-[var(--navigation-height)] w-full ",
          "!transition !duration-1000 !ease-in-out",
          "!bg-opacity-0 backdrop-blur-[5px] dark:bg-background", 
        )}
        style={{
          transition: "all 0.2s ease-in-out",
          WebkitBackdropFilter:
            "var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)",
          backdropFilter:
            "var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)",
        }}
      >
        <span
          style={{ maxWidth: "calc(1000px + calc(2 * 24px))" }}
          className="z-1 nowrap align-stretch relative mx-auto  grid w-full max-w-5xl grid-cols-2 sm:grid-cols-3"
        >
          <nav className="nowrap flex-start flex flex-row items-center">
            <SupraLogo />
          </nav>
          <nav className="hidden flex-row justify-center sm:flex">
            <HeaderNavigationMenu />
          </nav>
          <Suspense fallback={<SignInSignUpButtons />}>
            <RightNav />
          </Suspense>
        </span>
      </header>
    </>
  )
}
