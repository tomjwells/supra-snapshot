import { Suspense } from "react"
import { UsersIcon } from "@heroicons/react/24/outline"
import Skeleton from "react-loading-skeleton"

import MetricPanel from "../MetricPanel"
import ClientData from "./ClientData"

export default function RevenueCard({ from, to }: { from: Date; to: Date }) {
  return (
    <MetricPanel panelTitle="Subscriptions" Icon={UsersIcon}>
      <Suspense fallback={<Skeleton width="4rem" />}>
        <ClientData from={from} to={to} />
      </Suspense>
    </MetricPanel>
  )
}
