import type { Metadata } from "next"
import { Flex, Grid, Heading } from "@radix-ui/themes"
import z from "zod"

import ActiveNowCard from "./_components/ActiveNow/Card"
import { CalendarDateRangePicker } from "./_components/Calendar/date-range-picker"
import OverviewSection from "./_components/OverviewSection/OverviewSection"
import RecentSalesSection from "./_components/RecentSales/RecentSalesSection"
import RevenueCard from "./_components/Revenue/Card"
import SalesCard from "./_components/Sales/Card"
import SubscriptionsCard from "./_components/Subscriptions/Card"

export const runtime = "nodejs"

export const dateRangeSchema = z.object({
  from: z.coerce
    .date()
    .optional()
    .default(new Date(new Date().setDate(new Date().getDate() - 7))),
  to: z.coerce.date().optional().default(new Date()),
})

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard.",
}

export default function DashboardPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const { from, to } = dateRangeSchema.parse(searchParams)

  return (
    <Flex direction="column" gap="6" className="h-full">
      <Flex direction={{ initial: "column", xs: "row" }} justify="between" align="start" gap="3">
        <Heading as="h1" size="7" style={{ fontWeight: 600 }} className="truncate text-2xl leading-7 text-slate-12 sm:text-3xl sm:tracking-tight">
          Dashboard
        </Heading>
        <CalendarDateRangePicker from={from} to={to} />
      </Flex>
      <Grid
        gap="4"
        columns={{
          initial: "1",
          sm: "2",
          md: "4",
        }}
      >
        <RevenueCard from={from} to={to} />
        <SubscriptionsCard from={from} to={to} />
        <SalesCard from={from} to={to} />
        <ActiveNowCard from={from} to={to} />
      </Grid>
      <Grid
        gap="4"
        columns={{
          initial: "1",
          sm: "2",
          md: "7",
        }}
      >
        <span className="col-span-4 h-[440px]">
          <OverviewSection from={from} to={to} />
        </span>
        <span className="col-span-4 h-[440px] lg:col-span-3">
          <RecentSalesSection from={from} to={to} />
        </span>
      </Grid>
    </Flex>
  )
}
