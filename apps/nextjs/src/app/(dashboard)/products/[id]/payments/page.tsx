import { Suspense } from "react"
import { Flex } from "@radix-ui/themes"

import { listPaymentsByProductId } from "~/_backend/payments"
import { PaymentsTable } from "~/app/(dashboard)/payments/[id]/_components/PaymentsTable"

export const runtime = "nodejs"
export const metadata = {
  title: "Products",
}

export default async function Page({ params: { id } }: { params: { id: string } }) {
  return (
    <Flex direction="column" gap="6" className="h-full">
      <Suspense>
        <PaymentsTable payments={await listPaymentsByProductId(id)} />
      </Suspense>
    </Flex>
  )
}
