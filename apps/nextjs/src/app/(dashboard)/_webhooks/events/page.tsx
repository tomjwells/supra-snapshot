import { Suspense } from "react"
import Loading from "@acme/ui/loading"
import { Badge, Box, Button, Flex, Grid, Table, Text } from "@radix-ui/themes"

import OverviewPanels from "../_components/OverviewPanels"
import WebhookViewer from "../_components/WebhookViewer"

export const metadata = {
  title: "Webhook Events",
}

export default function Page() {
  return (
    <Flex direction="column" gap="6">
      <Suspense fallback={<Loading />}>
        <Box
          height="100%"
          style={{
            borderRadius: "var(--radius-4)",
            boxShadow: "0 0 0 1px var(--gray-a5)",
          }}
          className="flex flex-col"
          p="4"
        >
          <Flex direction="column" gap="2">
            <Flex direction="row" justify="between" align="center">
              <Flex direction="column">
                <Text size="3" weight="bold">
                  Webhook Settings <Badge color="green">Active</Badge>
                </Text>
                <Text size="2" color="gray">
                  https://suprapayments.io/webhooks
                </Text>
              </Flex>
              <Text size="2" color="gray">
                2 days ago
              </Text>
              <Button>Test Webhook</Button>
            </Flex>
            <Flex direction="row" justify="between" align="center">
              <div></div>
              <img src="https://user-images.githubusercontent.com/3165635/92232940-b1ece000-eeaf-11ea-95f9-469fc66c3aff.png" width="180px" />
            </Flex>
          </Flex>
        </Box>
      </Suspense>
      <Grid columns="2" gap="3">
        <Box>
          <Table.Root
            variant="surface"
            style={{
              borderRadius: "var(--radius-4)",
              boxShadow: "0 0 0 1px var(--gray-a5)",
              border: "0px",
            }}
          >
            <Table.Body>
              <Table.Row>
                <Table.RowHeaderCell p="4">
                  <WebhookEventCard eventType="payment.completed" />
                </Table.RowHeaderCell>
              </Table.Row>

              <Table.Row>
                <Table.RowHeaderCell p="4">
                  <WebhookEventCard eventType="payment.started" />
                </Table.RowHeaderCell>
              </Table.Row>

              <Table.Row>
                <Table.RowHeaderCell p="4">
                  <WebhookEventCard eventType="payment.completed" />
                </Table.RowHeaderCell>
              </Table.Row>
            </Table.Body>
          </Table.Root>
        </Box>
        <WebhookViewer />
      </Grid>
      <Suspense fallback={<Loading />}>
        <OverviewPanels />
      </Suspense>
    </Flex>
  )
}

function WebhookEventCard({ eventType }: { eventType: string }) {
  return (
    <Box>
      <Flex direction="column" gap="2">
        <Flex direction="row" justify="between">
          <Text size="2" weight="bold">
            {eventType} <Badge color="green">Complete</Badge>
          </Text>
          <Text size="2" color="gray">
            2 days ago
          </Text>
        </Flex>
        <Text size="2">Make changes to your account.</Text>
      </Flex>
    </Box>
  )
}
