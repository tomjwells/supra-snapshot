import { listPaymentsByCollectionId } from "~/_backend/payments"
import { PaymentsTable } from "~/app/(dashboard)/payments/[id]/_components/PaymentsTable"

export const runtime = "nodejs"

export const metadata = {
  title: "Collections",
}

export default async function Page({ params: { id } }: { params: { id: string } }) {
  return <PaymentsTable payments={await listPaymentsByCollectionId(id)} />
}
