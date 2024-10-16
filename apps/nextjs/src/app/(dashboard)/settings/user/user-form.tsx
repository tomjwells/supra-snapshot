"use client"

import React from "react"
import Link from "next/link"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@acme/shadcn/form"
import { EditButtons } from "@acme/ui"
import EditImageItem from "@acme/ui/Forms/EditImageItem"
import { Input } from "@acme/ui/Forms/Input"
import { zodResolver } from "@hookform/resolvers/zod"
import { ExternalLinkIcon } from "@radix-ui/react-icons"
import { Flex, Text } from "@radix-ui/themes"
import { useForm, useFormContext } from "react-hook-form"
import { z } from "zod"

import type { updateUser, UserType } from "~/_backend/users"

export const updateUserSchema = z.object({
  name: z.string().optional(),
  image: z.string().optional(),
  imageData: z.string().optional(),
})

export default function UserInformation({
  user,
  updateUserAction,
}: {
  user: UserType
  updateUserAction: (input: z.infer<typeof updateUserSchema>) => ReturnType<typeof updateUser>
}) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [edit, setEdit] = React.useState(!user?.name)
  const formAttribute = "hook-form"
  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
  })
  async function onSubmit(data: z.infer<typeof updateUserSchema>) {
    setIsLoading(true)
    const updatedUser = await updateUserAction(data)
    if (updatedUser) {
      setEdit(false)
      setIsLoading(false)
    }
  }
  if (!user) return null
  return (
    <Form {...form}>
      <form id={formAttribute} onSubmit={form.handleSubmit(onSubmit)}>
        <Flex justify="between" pb="4">
          <div>
            <h3 className="text-lg font-medium">User</h3>
            <Text size="2" className="text-gray-10">
              Update your user information
            </Text>
          </div>
          <EditButtons isLoading={isLoading} edit={edit} setEdit={setEdit} formAttribute={formAttribute} />
        </Flex>
        <UserForm edit={edit} user={user} />
      </form>
    </Form>
  )
}

function UserForm({ edit, user }: { edit: boolean; user: UserType }) {
  return (
    <Flex direction="column" gap="4">
      <NameField edit={edit} user={user} />

      <LogoField edit={edit} user={user} />
    </Flex>
  )
}

function NameField({ edit, user }: { edit: boolean; user: UserType }) {
  const form = useFormContext()

  return (
    <FormField
      control={form.control}
      name="name"
      defaultValue={user.name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            {!edit ? (
              <Text as="div" color="gray">
                {user.name}
              </Text>
            ) : (
              <Input placeholder="User name" {...field} />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function LogoField({ edit, user }: { edit: boolean; user: UserType }) {
  return (
    <Flex direction="column" gap="2">
      <Text as="label" size="2" weight="medium">
        Image
      </Text>
      <EditImageItem edit={edit} image={user?.image} alt={user?.name} fallbackIcon="UserGroupIcon" />
    </Flex>
  )
}

function MainnetWithdrawalAddressField({ edit, user }: { edit: boolean; user: UserType }) {
  const form = useFormContext()
  return (
    <FormField
      control={form.control}
      name="mainnetWithdrawalAddress"
      defaultValue={user.mainnetWithdrawalAddress ?? undefined}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Mainnet</FormLabel>
          <FormControl>
            {!edit ? (
              <Flex direction="row" justify="between" align="center" width="100%" className="text-slate-10" gap="3">
                {user?.mainnetWithdrawalAddress ? (
                  <>
                    <Text className="min-w-0 overflow-ellipsis">{user.mainnetWithdrawalAddress}</Text>
                    <Link target="_blank" href={`https://cexplorer.io/address/${user.mainnetWithdrawalAddress}`}>
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
function TestnetWithdrawalAddressField({ edit, user }: { edit: boolean; user: UserType }) {
  const form = useFormContext()
  return (
    <FormField
      control={form.control}
      name="testnetWithdrawalAddress"
      defaultValue={user.testnetWithdrawalAddress ?? undefined}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Testnet</FormLabel>
          <FormControl>
            {!edit ? (
              <Flex direction="row" justify="between" align="center" width="100%" className="text-slate-10" gap="3">
                {user?.testnetWithdrawalAddress ? (
                  <>
                    <Text className="min-w-0 overflow-ellipsis">{user.testnetWithdrawalAddress}</Text>
                    <Link target="_blank" href={`https://cexplorer.io/address/${user.mainnetWithdrawalAddress}`}>
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
