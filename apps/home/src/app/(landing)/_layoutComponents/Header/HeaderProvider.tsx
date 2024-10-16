"use client"

import React from "react"

export default function HeaderProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    if (typeof document !== "undefined") {
      const primaryHeader = document.querySelector("header")
      const scrollWatcher = document.querySelector("#scroll-watcher") ?? Object.assign(document.createElement("div"), { id: "scroll-watcher" })

      primaryHeader && primaryHeader.before(scrollWatcher) 

      const navObserver = new IntersectionObserver(
        (entries) => {
          primaryHeader && primaryHeader.classList.toggle("!bg-opacity-70", !entries[0].isIntersecting)
          primaryHeader && primaryHeader.classList.toggle("shadow-[inset_0_-1px_0_0_hsla(0,0%,100%,.05)]", !entries[0].isIntersecting)
          primaryHeader && primaryHeader.classList.toggle("!bg-opacity-0", entries[0].isIntersecting)
        },
        { rootMargin: "1px 0px 0px 0px" },
      )

      navObserver.observe(scrollWatcher)
    }
  }, [])

  return <>{children}</>
}
