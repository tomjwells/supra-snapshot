import { Suspense } from "react"
import dynamic from "next/dynamic"
import { CreditCardIcon } from "@heroicons/react/24/outline"
import Skeleton from "react-loading-skeleton"

import MetricPanel from "../MetricPanel"
import ClientData from "./ClientData"

// const ClientData = dynamic(() => import("./ClientData"), { ssr: false, loading: () => <Skeleton width="4rem" /> })

export default function RevenueCard({ from, to }: { from: Date; to: Date }) {
  return (
    <MetricPanel panelTitle="Sales" Icon={CreditCardIcon}>
      <Suspense fallback={<Skeleton width="4rem" />}>
        <ClientData from={from} to={to} />
      </Suspense>
    </MetricPanel>
  )
}
