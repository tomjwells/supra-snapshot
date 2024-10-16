"use client"

import React from "react"
import DropdownOptionsFormControl from "@acme/ui/Forms/DropdownOptionsFormControl"
import { Input } from "@acme/ui/Forms/Input"
import DetailPanel from "@acme/ui/List/[id]/DetailPanel"
import StatusBadge from "@acme/ui/StatusBadge"
import { NotificationSourceStatus } from "@prisma/client"
import { FormProvider, useForm } from "react-hook-form"

import { useDeleteNotificationSource, useEditNotificationSource } from "~/app/(dashboard)/notification-sources/hooks"
import type { RouterInputs } from "~/utils/api"

export default function InformationPanel({ id }: { id: string }) {
  const [notificationSource, _query] = api.notificationSources.get.useSuspenseQuery({
    id,
  })

  const [edit, setEdit] = React.useState(false)
  const formAttribute = "hook-form"
  const methods = useForm<RouterInputs["notificationSources"]["edit"]>()

  const { mutate } = useEditNotificationSource(setEdit)
  const onSubmit = (data: RouterInputs["notificationSources"]["edit"]) => {

    mutate(data)
  }
  const { mutate: deleteMutate } = useDeleteNotificationSource()

  if (!notificationSource) {
    return null
  }
  return (
    <DetailPanel
      title="Notification Source Information"
      edit={edit}
      setEdit={setEdit}
      formAttribute={formAttribute}
      deleteId={notificationSource.id}
      mutate={() => deleteMutate({ id: notificationSource.id })}
      modelName="notification source"
      fullWidth
    >
      <FormProvider {...methods}>
        <form id={formAttribute} onSubmit={methods.handleSubmit(onSubmit)}>
          <input type="hidden" {...methods.register("id")} defaultValue={notificationSource.id} />
          <dl className="divide-y divide-gray-4">
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-slate-12">Name</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-11 sm:col-span-2 sm:mt-0">
                {!edit ? <div className="py-1.5">{notificationSource.name}</div> : <Input registerName="name" defaultValue={notificationSource.name || ""} />}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-slate-12">Type</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-11 sm:col-span-2 sm:mt-0">
                {!edit ? (
                  <div className="py-1.5 capitalize">{notificationSource.type}</div>
                ) : (
                  <DropdownOptionsFormControl name="type" defaultValue={notificationSource.type} rules={{ required: true }} options={{ email: "email" }} />
                )}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-slate-12">Email</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-11 sm:col-span-2 sm:mt-0">
                {!edit ? (
                  <div className="py-1.5">{notificationSource.email_address}</div>
                ) : (
                  <Input registerName="email_address" defaultValue={notificationSource.email_address || ""} />
                )}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-slate-12">Status</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-11 sm:col-span-2 sm:mt-0">
                <div className="py-1.5">
                  <StatusBadge
                    status={
                      (notificationSource.status === NotificationSourceStatus.ACTIVE && "success") ||
                      (notificationSource.status === NotificationSourceStatus.INACTIVE && "neutral")
                    }
                    text={notificationSource.status}
                  />
                </div>
              </dd>
            </div>
          </dl>
        </form>
      </FormProvider>
    </DetailPanel>
  )
}
