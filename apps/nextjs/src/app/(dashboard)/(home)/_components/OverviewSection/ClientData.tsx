import React from "react"

import { getEnvironment } from "~/_backend/environments"
import { listPayments } from "~/_backend/payments"
import { Chart } from "./Chart"

export default async function ClientData({ from, to }: { from: Date; to: Date }) {
  const payments = await listPayments(from, to)
  const network = await getEnvironment()

  if (!from || !to) return null

  const salesByDay: Record<string, number> = {}
  const date = from
  const daysInDateRange = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24))
  if (daysInDateRange < 30) {
    // Case (i): date range is < 30 days
    while (date <= new Date(to)) {
      const name = date.toLocaleDateString(undefined, { month: "2-digit", day: "2-digit" })
      salesByDay[name] = 0
      for (const payment of payments) {
        const paymentDate = new Date(payment.createdAt).toLocaleDateString(undefined, { month: "2-digit", day: "2-digit" })
        if (paymentDate === name) {
          salesByDay[name] += parseFloat(payment.totalAmountCharged.toString()) * parseFloat(payment.totalAmountChargedCurrency.lastPrice.toString())
        }
      }
      date.setDate(date.getDate() + 1)
    }
  } else {
    // Case (ii): date range is >= 30 days
    const weeksInDateRange = Math.ceil(daysInDateRange / 7)
    for (let i = 0; i < weeksInDateRange; i++) {
      const weekStart = new Date(from)
      weekStart.setDate(weekStart.getDate() + i * 7)
      const weekEnd = new Date(Math.min(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000, new Date(to).getTime()))
      const name = `${weekStart.toLocaleDateString(undefined, { month: "2-digit", day: "2-digit" })} - ${weekEnd.toLocaleDateString(undefined, {
        month: "2-digit",
        day: "2-digit",
      })}`
      salesByDay[name] = 0
      for (const payment of payments) {
        const paymentDate = new Date(payment.createdAt)
        if (paymentDate >= weekStart && paymentDate <= weekEnd) {
          salesByDay[name] += parseFloat(payment.totalAmountCharged.toString()) * parseFloat(payment.totalAmountChargedCurrency.lastPrice.toString())
        }
      }
    }
  }
  const data = Object.entries(salesByDay).map(([name, total]) => ({ name, total }))

  return <Chart data={data} network={network.network} />
}
