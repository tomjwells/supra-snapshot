import { Suspense } from "react"
import { prisma } from "@acme/db"
import Loading from "@acme/ui/loading"
import { Box, Card, Flex, Text } from "@radix-ui/themes"

import { auth } from "~/utils/auth"

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

async function NotificationSourceCount() {
  return (
    <Card variant="classic">
      <Box p="2">
        <Flex direction="column" gap="2">
          <Text size="2" weight="medium" color="gray" className="truncate">
            Notification Sources
          </Text>
          <Text size="7" className="font-semibold tracking-tight text-slate-12 ">
            {await prisma.notificationSource.count({
              where: { environmentId: (await auth())?.user?.selectedEnvironmentId },
            })}
          </Text>
        </Flex>
      </Box>
    </Card>
  )
}

async function NotificationsSent() {
  const session = await auth()
  return (
    <Card variant="classic">
      <Box p="2">
        <Flex direction="column" gap="2">
          <Text size="2" weight="medium" color="gray" className="truncate">
            Notifications Sent
          </Text>
          <Text size="7" className="font-semibold tracking-tight text-slate-12 ">
            {await prisma.notification.count({
              where: {
                notificationSource: {
                  is: {
                    environmentId: session?.user?.selectedEnvironmentId,
                  },
                },
              },
            })}
          </Text>
        </Flex>
      </Box>
    </Card>
  )
}

async function DeliveryRate() {
  const session = await auth()

  const notificationsSent = await prisma.notification.count({
    where: {
      notificationSource: {
        is: {
          environmentId: session?.user?.selectedEnvironmentId,
        },
      },
    },
  })
  const notificationErrorCount = await prisma.notification.count({
    where: {
      notificationSource: {
        is: { environmentId: session?.user?.selectedEnvironmentId },
      },
      status: "error",
    },
  })

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
