import { Suspense } from "react"
import Skeleton from "react-loading-skeleton"

import MetricPanel from "../MetricPanel"
import ClientData from "./ClientData"

export default function RevenueCard({ from, to }: { from: Date; to: Date }) {
  return (
    <MetricPanel panelTitle="Revenue" Icon="₳">
      <Suspense fallback={<Skeleton width="4rem" />}>
        <ClientData from={from} to={to} />
      </Suspense>
    </MetricPanel>
  )
}
