import { getEnvironment } from "~/_backend/environments"
import { listPayments } from "~/_backend/payments"
import { Price } from "~/utils/ClientPrice"

export default async function RevenueClientData({ from, to }: { from: Date; to: Date }) {
  const [payments, environment] = await Promise.all([listPayments(from, to), await getEnvironment()])

  const totalRevenue = payments.reduce(
    (acc, payment) => acc + parseFloat(payment.totalAmountCharged.toString()) * parseFloat(payment.totalAmountChargedCurrency.lastPrice.toString()),
    0,
  )

  return <Price price={totalRevenue ?? 0} network={environment.network} symbol="₳" />
}
