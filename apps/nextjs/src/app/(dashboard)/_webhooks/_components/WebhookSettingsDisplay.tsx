"use client"

import React from "react"
import { Avatar, Badge, Box, Button, Card, Checkbox, Flex, Grid, Heading, IconButton, Separator, Table, Text, TextField } from "@radix-ui/themes"

function WebhookSettingsDisplay() {
  const [webhook, _query] = api.webhooks.getByEnvironmenId.useSuspenseQuery()

  return (
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
              Webhook Settings{" "}
              <Badge color={webhook.status === "ACTIVE" ? "green" : "red"} className="capitalize">
                {webhook.status.toLowerCase()}
              </Badge>
            </Text>
            <Text size="2" color="gray">
              {webhook.url}
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
  )
}

export default WebhookSettingsDisplay
