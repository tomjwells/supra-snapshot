import React, { Suspense } from "react"
import DetailPanel from "@acme/ui/List/[id]/DetailPanel"
import Loading from "@acme/ui/loading"
import { Avatar, Badge, Box, Button, Card, Checkbox, Flex, Grid, Heading, IconButton, Separator, Table, Text, TextField } from "@radix-ui/themes"

import WebhookSettingsDisplay from "../_components/WebhookSettingsDisplay"
import WebhookSettingsBody from "./WebhookSettingsBody"

export const metadata = {
  title: "Webhook Settings",
}

export default function Page() {
  return (
    <Flex direction="column" gap="6">
      <Suspense fallback={<Loading />}>
        <WebhookSettingsDisplay />
      </Suspense>
      <Suspense fallback={<Loading />}>
        <WebhookSettingsBody />
      </Suspense>
    </Flex>
  )
}
