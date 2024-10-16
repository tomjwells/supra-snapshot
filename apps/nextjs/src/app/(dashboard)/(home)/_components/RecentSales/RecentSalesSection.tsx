import { Suspense } from "react"
import Link from "next/link"
import { cloudinaryImageSrc } from "@acme/cloudinary/cloudinary-client"
import { Avatar, Box, Card, Flex, Heading, Separator, Text } from "@radix-ui/themes"
import Skeleton from "react-loading-skeleton"

import type { PaymentsType } from "~/_backend/payments"
import { listPayments } from "~/_backend/payments"
import { Price } from "~/utils/ClientPrice"

export default async function RecentSalesSection({ from, to }: { from: Date; to: Date }) {
  const payments = await listPayments(from, to)
  return (
    <Card size="4" className="h-full">
      <Flex direction="column" className="h-full">
        <Heading as="h3" size="6" trim="start" mb="2">
          Recent sales
        </Heading>

        <Text as="p" size="2" mb="3" color="gray">
          Review what has happened over the past days.
        </Text>
        <Suspense fallback={<ListSkeleton />}>
          <Flex direction="column" className="h-full flex-1 overflow-y-auto">
            {payments.length === 0 && <div className="flex justify-center text-center text-theme-secondary">No recent sales</div>}
            {payments.map((payment, i) => (
              <Box key={payment.id}>
                <SaleItem payment={payment} />
                {i !== payments.length - 1 && (
                  <Box style={{ marginTop: -1 }}>
                    <Separator size="4" />
                  </Box>
                )}
              </Box>
            ))}
          </Flex>
        </Suspense>
      </Flex>
    </Card>
  )
}

function ListSkeleton() {
  return (
    <Flex direction="column">
      {Array.from({ length: 3 }).map((item, i) => (
        <Box key={i}>
          <ItemSkeleton />
          {i !== 2 && (
            <Box style={{ marginTop: -1 }}>
              <Separator size="4" />
            </Box>
          )}
        </Box>
      ))}
    </Flex>
  )
}

function ItemSkeleton() {
  return (
    <Flex justify="between" align="center" my="3">
      <Flex gap="3" align="center">
        <Skeleton width={40} height={40} style={{ borderRadius: "max(var(--radius-3), var(--radius-full))" }} />

        <Box>
          <Text as="div" size="2" weight="bold">
            <Skeleton width={120} height={16} />
          </Text>
          <Text as="div" size="2" color="gray">
            <Skeleton width={80} height={12} />
          </Text>
        </Box>
      </Flex>

      <Text size="2" color="gray">
        <Skeleton width={80} height={12} />
      </Text>
    </Flex>
  )
}

function SaleItem({ payment }: { payment: PaymentsType[number] }) {
  const formattedDate = payment.createdAt.toLocaleString("en-US", { month: "long", day: "numeric", hour: "numeric", minute: "numeric", hour12: true })
  return (
    <Link href={`/payments/${payment.id}`}>
      <Flex justify="between" align="center" my="3">
        <Flex gap="3" align="center">
          <Avatar size="3" src={cloudinaryImageSrc(payment.product.image)} fallback={payment.product.name?.toUpperCase()[0] ?? "S"} />
          <Box>
            <Text as="div" size="2" weight="bold">
              {payment.product.name}
            </Text>
            <Text as="div" size="2" color="gray">
              <Price
                price={payment.totalAmountCharged}
                network={payment.network}
                symbol={payment.totalAmountChargedCurrency.symbol ?? payment.totalAmountChargedCurrency.ticker}
              />
            </Text>
          </Box>
        </Flex>

        <Text size="2" color="gray">
          {formattedDate}
        </Text>
      </Flex>
    </Link>
  )
}
