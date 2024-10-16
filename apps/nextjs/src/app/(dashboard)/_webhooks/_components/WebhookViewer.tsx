"use client"

import React from "react"
import { Box, Card, Flex, Inset, Tabs, Text } from "@radix-ui/themes"

export default function WebhookViewer() {
  return (
    <Tabs.Root defaultValue="sent" style={{ height: "100%" }}>
      <Box
        height="100%"
        style={{
          borderRadius: "var(--radius-4)",
          boxShadow: "0 0 0 1px var(--gray-a5)",
        }}
        className="flex flex-col"
      >
        <Box style={{ borderBottom: "1px solid var(--gray-a5)" }} p="4">
          <Tabs.List>
            <Tabs.Trigger value="sent">Sent</Tabs.Trigger>
            <Tabs.Trigger value="received">Received</Tabs.Trigger>
          </Tabs.List>
        </Box>
        <Box
          p="4"
          className="flex-grow"
          style={{
            backgroundColor: "hsl(227.17deg 100% 43.18% / 2.8%)",
          }}
        >
          <Tabs.Content value="sent">
            <Text size="2">Make changes to your account.</Text>
          </Tabs.Content>

          <Tabs.Content value="received">
            <Text size="2">Access and update your documents.</Text>
          </Tabs.Content>
        </Box>
      </Box>
    </Tabs.Root>
  )
}
