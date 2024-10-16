"use client"

import React from "react"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@acme/shadcn/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@acme/shadcn/select"
import { EditButtons } from "@acme/ui"
import { Input } from "@acme/ui/Forms/Input"
import DetailPanel from "@acme/ui/List/[id]/DetailPanel"
import { zodResolver } from "@hookform/resolvers/zod"
import { NotificationSourceType as NotificationSourceEnum, NotificationSourceStatus } from "@prisma/client"
import { Badge } from "@radix-ui/themes"
import { useForm, useFormContext } from "react-hook-form"
import { z } from "zod"

import { updateNotificationSourcesAction } from "~/_actions/notificationSources"
import type { NotificationSourceType } from "~/_backend/notificationSources"

const formSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.nativeEnum(NotificationSourceEnum),
  email_address: z.string().email(),
  status: z.nativeEnum(NotificationSourceStatus),
})

export default function InformationPanel({ notificationSource }: { notificationSource: NotificationSourceType }) {
  const [edit, setEdit] = React.useState(false)
  const formAttribute = "hook-form"
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: notificationSource,
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const updatedNotificationSource = await updateNotificationSourcesAction(data)
    if (updatedNotificationSource) {
      setEdit(false)
    }
  }

  if (!notificationSource) {
    return null
  }
  return (
    <DetailPanel
      title="Notification Source Information"
      fullWidth
      RightHeadingActions={<EditButtons edit={edit} setEdit={setEdit} formAttribute={formAttribute} />}
    >
      <Form {...form}>
        <form id={formAttribute} onSubmit={form.handleSubmit(onSubmit)}>
          <input type="hidden" {...form.register("id")} defaultValue={notificationSource.id} />
          <dl className="divide-y divide-gray-4">
            <FormField
              control={form.control}
              name="name"
              defaultValue={notificationSource.name ?? undefined}
              render={({ field }) => (
                <FormItem>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-slate-12">Name</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-11 sm:col-span-2 sm:mt-0">
                      <FormControl>{!edit ? <div className="py-1.5">{notificationSource.name}</div> : <Input {...field} />}</FormControl>
                    </dd>
                  </div>
                </FormItem>
              )}
            />

            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-slate-12">Type</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-11 sm:col-span-2 sm:mt-0">
                {!edit ? (
                  <div className="py-1.5 capitalize">{notificationSource.type.toLocaleLowerCase()}</div>
                ) : (
                  <>
                    <div className="py-1.5 capitalize">{notificationSource.type.toLocaleLowerCase()}</div>
                    <input type="hidden" {...form.register("type")} defaultValue={notificationSource.type || NotificationSourceType.EMAIL} />
                  </>
                )}
              </dd>
            </div>

            <FormField
              control={form.control}
              name="email_address"
              defaultValue={notificationSource.email_address ?? undefined}
              render={({ field }) => (
                <FormItem>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-slate-12">Email</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-11 sm:col-span-2 sm:mt-0">
                      <FormItem>
                        <FormControl>
                          {!edit ? (
                            <div className="py-1.5">{notificationSource.email_address || "--"}</div>
                          ) : (
                            <>
                              <Input {...field} placeholder="email@example.com" />
                              <FormMessage />
                            </>
                          )}
                        </FormControl>
                      </FormItem>
                    </dd>
                  </div>
                </FormItem>
              )}
            />

            <StatusField notificationSource={notificationSource} edit={edit} />
          </dl>
        </form>
      </Form>
    </DetailPanel>
  )
}

function StatusField({ notificationSource, edit }: { notificationSource: NotificationSourceType; edit: boolean }) {
  const form = useFormContext()
  if (!notificationSource) return null
  return (
    <FormField
      control={form.control}
      name="status"
      defaultValue={notificationSource.status ?? undefined}
      render={({ field }) => (
        <FormItem>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-slate-12">Status</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-11 sm:col-span-2 sm:mt-0">
              <FormControl>
                {!edit ? (
                  <Badge color={notificationSource.status === NotificationSourceStatus.ACTIVE ? "green" : "gray"} className="capitalize">
                    {notificationSource.status.toLowerCase()}
                  </Badge>
                ) : (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="capitalize">
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(NotificationSourceStatus).map((status) => (
                        <SelectItem value={status[1]} className="capitalize" key={status[1]}>
                          {status[1].toLocaleLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </FormControl>
            </dd>
          </div>
        </FormItem>
      )}
    />
  )
}
