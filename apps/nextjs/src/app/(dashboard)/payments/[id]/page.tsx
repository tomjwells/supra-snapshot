import { Suspense } from "react"
import Loading from "@acme/ui/loading"
import PageHeader from "@acme/ui/PageHeader"
import { Flex } from "@radix-ui/themes"

import CustomerInformation from "./_components/CustomerInformation"
import PaymentInformation from "./_components/PaymentInformation"

export const runtime = "nodejs"

interface Props {
  params: { id: string }
  searchParams: Record<string, string | string[] | undefined>
}

export function generateMetadata({ params }: Props) {
  return {
    title: "Payment " + params.id,
  }
}

export default function Page({ params: { id } }: { params: { id: string } }) {
  return (
    <Flex direction="column" gap="6" className="h-full">
      <PageHeader title={`Payment ${id}`} />
      <Suspense fallback={<Loading />}>
        <PaymentInformation id={id} />
      </Suspense>
      <Suspense fallback={<Loading />}>
        <CustomerInformation id={id} />
      </Suspense>
    </Flex>
  )
}
