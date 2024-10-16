import { PaymentStatus } from "@acme/db"

import { listPayments } from "~/_backend/payments"

export default async function SalesCard({ from, to }: { from: Date; to: Date }) {
  const payments = await listPayments(from, to)
  const count = payments.filter((payment) => payment.status === PaymentStatus.COMPLETE).length
  return "+" + count.toLocaleString()
}
