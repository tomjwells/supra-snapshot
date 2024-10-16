"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { DateRangePicker } from "@acme/shadcn/date-range-picker"

export function CalendarDateRangePicker({ from, to }: { from: Date; to: Date }) {
  const [_isLoading, startTransition] = useTransition()
  const router = useRouter()

  return (
    <DateRangePicker
      initialDateFrom={from}
      initialDateTo={to}
      onUpdate={(values) => {
        values.range.from?.setHours(0, 0, 0, 0)
        values.range.to?.setHours(23, 59, 59, 999)
        if (values.range.to instanceof Date) {
          startTransition(() => {
            router.push(`/?from=${values.range.from.toISOString()}&to=${values.range.to?.toISOString()}`)
          })
        }
      }}
      showCompare={false}
    />
  )
}
