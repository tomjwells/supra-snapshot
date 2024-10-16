"use client"

import React from "react"
import Link from "next/link"
import { OrganizationTier } from "@acme/db"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@acme/shadcn/form"
import { EditButtons } from "@acme/ui"
import EditImageItem from "@acme/ui/Forms/EditImageItem"
import { Input } from "@acme/ui/Forms/Input"
import TooltipPopover from "@acme/ui/TooltipPopover"
import { zodResolver } from "@hookform/resolvers/zod"
import { ExternalLinkIcon } from "@radix-ui/react-icons"
import { Flex, Text } from "@radix-ui/themes"
import { useForm, useFormContext } from "react-hook-form"
import { z } from "zod"

import type { OrganizationType, updateOrganization } from "~/_backend/organizations"

export const updateOrganizationSchema = z.object({
  name: z.string().optional(),
  image: z.string().optional(),
  imageData: z.string().optional(),
  mainnetWithdrawalAddress: z
    .string()
    .trim()
    .startsWith("addr1", 'Check whether the withdrawal address is formatted correctly (it should start with "addr1").')
    .optional()
    .or(z.literal("")),
  testnetWithdrawalAddress: z
    .string()
    .trim()
    .startsWith("addr_test1", 'Check whether the withdrawal address is formatted correctly (it should start with "addr_test1").')
    .optional()
    .or(z.literal("")),
  tier: z.nativeEnum(OrganizationTier).optional(),
})

export default function OrganizationInformation({
  organization,
  updateOrganizationAction,
}: {
  organization: OrganizationType
  updateOrganizationAction: (input: z.infer<typeof updateOrganizationSchema>) => ReturnType<typeof updateOrganization>
}) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [edit, setEdit] = React.useState(!organization?.name)
  const formAttribute = "hook-form"
  const form = useForm<z.infer<typeof updateOrganizationSchema>>({
    resolver: zodResolver(updateOrganizationSchema),
  })
  async function onSubmit(data: z.infer<typeof updateOrganizationSchema>) {
    setIsLoading(true)
    const updatedOrganization = await updateOrganizationAction(data)
    if (updatedOrganization) {
      setEdit(false)
      setIsLoading(false)
    }
  }
  if (!organization) return null
  return (
    <Form {...form}>
      <form id={formAttribute} onSubmit={form.handleSubmit(onSubmit)}>
        <Flex justify="between" pb="4">
          <div>
            <h3 className="text-lg font-medium">Organization</h3>
            <Text size="2" className="text-gray-10">
              Update your account settings and Cardano addresses.
            </Text>
          </div>
          <EditButtons isLoading={isLoading} edit={edit} setEdit={setEdit} formAttribute={formAttribute} />
        </Flex>
        <OrganizationForm edit={edit} organization={organization} />
      </form>
    </Form>
  )
}

function OrganizationForm({ edit, organization }: { edit: boolean; organization: OrganizationType }) {
  return (
    <Flex direction="column" gap="4">
      <NameField edit={edit} organization={organization} />

      <LogoField edit={edit} organization={organization} />

      <Flex direction="column" gap="4">
        <Flex direction="row" align="center" gap="2">
          <label htmlFor="website" className="block text-sm font-medium leading-6 text-slate-12">
            Withdrawal Addresses
          </label>
          <TooltipPopover text="Funds will be sent to these Cardano addresses when customers purchase your products." />
        </Flex>

        <MainnetWithdrawalAddressField edit={edit} organization={organization} />
        <TestnetWithdrawalAddressField edit={edit} organization={organization} />
      </Flex>
    </Flex>
  )
}

function NameField({ edit, organization }: { edit: boolean; organization: OrganizationType }) {
  const form = useFormContext()

  return (
    <FormField
      control={form.control}
      name="name"
      defaultValue={organization.name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            {!edit ? (
              <Text as="div" color="gray">
                {organization.name}
              </Text>
            ) : (
              <Input placeholder="Organization name" {...field} />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function LogoField({ edit, organization }: { edit: boolean; organization: OrganizationType }) {
  return (
    <Flex direction="column" gap="2">
      <Text as="label" size="2" weight="medium">
        Logo
      </Text>
      <EditImageItem edit={edit} image={organization?.image} alt={organization?.name} fallbackIcon="UserGroupIcon" />
    </Flex>
  )
}

function MainnetWithdrawalAddressField({ edit, organization }: { edit: boolean; organization: OrganizationType }) {
  const form = useFormContext()
  return (
    <FormField
      control={form.control}
      name="mainnetWithdrawalAddress"
      defaultValue={organization.mainnetWithdrawalAddress ?? undefined}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Mainnet</FormLabel>
          <FormControl>
            {!edit ? (
              <Flex direction="row" justify="between" align="center" width="100%" className="text-slate-10" gap="3">
                {organization?.mainnetWithdrawalAddress ? (
                  <>
                    <Text className="min-w-0 overflow-ellipsis">{organization.mainnetWithdrawalAddress}</Text>
                    <Link target="_blank" href={`https://cexplorer.io/address/${organization.mainnetWithdrawalAddress}`}>
                      <ExternalLinkIcon />
                    </Link>
                  </>
                ) : (
                  <em>-- No mainnet address set --</em>
                )}
              </Flex>
            ) : (
              <>
                <Input placeholder="addr1..." {...field} />
              </>
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
function TestnetWithdrawalAddressField({ edit, organization }: { edit: boolean; organization: OrganizationType }) {
  const form = useFormContext()
  return (
    <FormField
      control={form.control}
      name="testnetWithdrawalAddress"
      defaultValue={organization.testnetWithdrawalAddress ?? undefined}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Testnet</FormLabel>
          <FormControl>
            {!edit ? (
              <Flex direction="row" justify="between" align="center" width="100%" className="text-slate-10" gap="3">
                {organization?.testnetWithdrawalAddress ? (
                  <>
                    <Text className="min-w-0 overflow-ellipsis">{organization.testnetWithdrawalAddress}</Text>
                    <Link target="_blank" href={`https://cexplorer.io/address/${organization.mainnetWithdrawalAddress}`}>
                      <ExternalLinkIcon />
                    </Link>
                  </>
                ) : (
                  <em>-- No testnet address set --</em>
                )}
              </Flex>
            ) : (
              <>
                <Input placeholder="addr_test1..." {...field} />
                <FormDescription>Please use an address on the preproduction network.</FormDescription>
              </>
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
