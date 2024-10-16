import { Suspense } from "react"
import Loading from "@acme/ui/loading"
import PageHeader from "@acme/ui/PageHeader"
import { Flex } from "@radix-ui/themes"

import { listPayments } from "~/_backend/payments"
import { PaymentsTable } from "./[id]/_components/PaymentsTable"

export const runtime = "nodejs"

export const metadata = {
  title: "Payments",
}

export default async function Page() {
  return (
    <Flex direction="column" gap="6" className="h-full">
      <PageHeader title="Payments" />
      <Suspense fallback={<Loading />}>
        <PaymentsTable payments={await listPayments()} />
      </Suspense>
    </Flex>
  )
}
