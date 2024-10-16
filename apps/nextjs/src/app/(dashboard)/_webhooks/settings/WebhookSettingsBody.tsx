"use client"

import React,  from "react"
import Link from "next/link"
import EditImageItem from "@acme/ui/Forms/EditImageItem"
import { Input } from "@acme/ui/Forms/Input"
import TooltipPopover from "@acme/ui/TooltipPopover"
import DetailPanel from "@acme/ui/List/[id]/DetailPanel"
import { zodResolver } from "@hookform/resolvers/zod"
import { ExternalLinkIcon } from "@radix-ui/react-icons"
import { Avatar, Badge, Box, Button, Card, Checkbox, Flex, Grid, Heading, IconButton, Separator, Table, Text, TextField } from "@radix-ui/themes"
import { FormProvider, useForm } from "react-hook-form"
import { z } from "zod"
import { WebhookStatus } from "@prisma/client"

import type { RouterInputs, RouterOutputs } from "~/utils/api"
import { useEditWebhook } from "../hooks"
import SwitchField from "@acme/ui/Forms/SwitchField"

const editWebhookSchema = z.object({
  id: z.string(),
  url: z.string(),
  status: z.nativeEnum(WebhookStatus),
})

export default function WebhookSettingsBody({}) {
  const [webhook, _query] = api.webhooks.getByEnvironmenId.useSuspenseQuery()

  const [edit, setEdit] = React.useState(false)
  const formAttribute = "edit-webhook-form"
  const { mutate } = useEditWebhook(setEdit)

  return (
    <DetailPanel
      title="Webhook Information"
      edit={edit}
      setEdit={setEdit}
      formAttribute={formAttribute}
    >
      <Body edit={edit} setEdit={setEdit} formAttribute={formAttribute} mutate={mutate} />
    </DetailPanel>
  )
}

function Body({
  edit,
  formAttribute,
  mutate,
}: {
  edit: boolean
  formAttribute: string
  mutate: ReturnType<typeof editWebhookSchema>["mutate"]
}) {
  const [webhook, _query] = api.webhooks.getByEnvironmenId.useSuspenseQuery()

  const form = useForm<RouterInputs["webhooks"]["edit"]>({
    resolver: zodResolver(editWebhookSchema),
  })

  const onSubmit = (data: RouterInputs["webhooks"]["edit"]) => {
    mutate(data)
  }
  return (
    <FormProvider {...form}>
      <Flex direction="column" gap="4" asChild>
        <form id={formAttribute} onSubmit={form.handleSubmit(onSubmit)}>
          <input className="hidden" {...form.register("id")} value={webhook.id} />
          <Flex direction="column" gap="2">
            <Text as="label" size="2" weight="medium">
              URL
            </Text>
            {!edit ? (
              <Text color="gray">{webhook.url}</Text>
            ) : (
              <Input registerName="url" registerOptions={{ required: true }} defaultValue={webhook.url} />
            )}
          </Flex>

               <SwitchField
          title="Status"
          subtitle="Set the status of this webhook as active or inactive."
          checked={webhook.status === WebhookStatus.ACTIVE}
          disabled={!edit}
          onCheckedChange={(e) => form.setValue("status", e ? WebhookStatus.ACTIVE : WebhookStatus.INACTIVE)}
        />
        </form>
      </Flex>
    </FormProvider>
  )
}
