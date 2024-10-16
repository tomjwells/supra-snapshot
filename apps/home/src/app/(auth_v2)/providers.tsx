"use client"

import { HogProvider } from "@acme/analytics/posthog"

export default function Providers({ children }: { children: React.ReactNode }) {
  return <HogProvider>{children}</HogProvider>
}
