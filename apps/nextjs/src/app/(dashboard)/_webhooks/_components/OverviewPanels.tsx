"use client"

import { Suspense } from "react"
import Loading from "@acme/ui/loading"
import { Box, Card, Flex, Text } from "@radix-ui/themes"

export default function OverviewPanels() {
  return (
    <div>
      <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Suspense fallback={<Loading />}>
          <NotificationSourceCount />
        </Suspense>
        <Suspense fallback={<Loading />}>
          <NotificationsSent />
        </Suspense>
        <Suspense fallback={<Loading />}>
          <DeliveryRate />
        </Suspense>
      </dl>
    </div>
  )
}

function NotificationSourceCount() {
  const [data, _query] = api.notificationSources.notificationSourcesOverviewData.useSuspenseQuery()
  const notificationSourceCount = data[0]
  return (
    <Card variant="classic">
      <Box p="2">
        <Flex direction="column" gap="2">
          <Text size="2" weight="medium" color="gray" className="truncate">
            Notification Sources
          </Text>
          <Text size="7" className="font-semibold tracking-tight text-slate-12 ">
            {notificationSourceCount}
          </Text>
        </Flex>
      </Box>
    </Card>
  )
}

function NotificationsSent() {
  const [data, _query] = api.notificationSources.notificationSourcesOverviewData.useSuspenseQuery()
  const notificationsSent = data[1]
  return (
    <Card variant="classic">
      <Box p="2">
        <Flex direction="column" gap="2">
          <Text size="2" weight="medium" color="gray" className="truncate">
            Notifications Sent
          </Text>
          <Text size="7" className="font-semibold tracking-tight text-slate-12 ">
            {notificationsSent}
          </Text>
        </Flex>
      </Box>
    </Card>
  )
}

function DeliveryRate() {
  const [data, _query] = api.notificationSources.notificationSourcesOverviewData.useSuspenseQuery()
  const notificationsSent = data[1]
  const notificationErrorCount = data[2]

  return (
    <Card variant="classic">
      <Box p="2">
        <Flex direction="column" gap="2">
          <Text size="2" weight="medium" color="gray" className="truncate">
            Delivery Rate
          </Text>
          <Text size="7" className="font-semibold tracking-tight text-slate-12 ">
            {notificationsSent === 0 ? <p className="text-theme-secondary">--</p> : `${((1 - notificationErrorCount / notificationsSent) * 100).toFixed(0)}%`}
          </Text>
        </Flex>
      </Box>
    </Card>
  )
}
