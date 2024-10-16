import React, { Suspense } from "react"
import { CardContent, CardHeader, CardTitle } from "@acme/shadcn/card"
import { Card } from "@radix-ui/themes"

import ClientData from "./ClientData"

export default function OverviewSection({ from, to }: { from: Date; to: Date }) {
  return (
    <Card variant="surface" m="0">
      <CardHeader className="px-2 pb-6 pt-4">
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <CardContent className="px-1 pb-2">
        <Suspense>
          <ClientData from={from} to={to} />
        </Suspense>
      </CardContent>
    </Card>
  )
}
