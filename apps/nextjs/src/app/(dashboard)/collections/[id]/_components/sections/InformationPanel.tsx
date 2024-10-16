"use client"

import React from "react"
import { redirect } from "next/navigation"
import { Form, FormControl, FormField, FormItem } from "@acme/shadcn/form"
import { EditButtons } from "@acme/ui"
import { Input } from "@acme/ui/Forms/Input"
import DetailPanel from "@acme/ui/List/[id]/DetailPanel"
import { useForm, useFormContext } from "react-hook-form"
import type z from "zod"

import { updateCollectionAction } from "~/_actions/collections"
import type { CollectionType, updateCollectionSchema } from "~/_backend/collections"

export default function InformationPanel({ collection }: { collection: CollectionType }) {
  const [edit, setEdit] = React.useState(false)
  const formAttribute = "hook-form"
  const form = useForm<z.infer<typeof updateCollectionSchema>>()

  React.useEffect(() => {
    if (collection && !collection.name) {
      setEdit(true)
    }
  }, [collection])

  const onSubmit = form.handleSubmit(async (data: z.infer<typeof updateCollectionSchema>) => {
    console.log("submitted:", data)

    const updatedCollection = await updateCollectionAction(data)
    if (updatedCollection) {
      setEdit(false)
    }
  })

  if (!collection) return redirect(`/collections`)

  return (
    <Form {...form}>
      <form id={formAttribute} onSubmit={onSubmit}>
        <DetailPanel
          title="Collection Information"
          subtitle="Basic information for your collection."
          fullWidth
          RightHeadingActions={<EditButtons edit={edit} setEdit={setEdit} formAttribute={formAttribute} />}
        >
          <input type="hidden" {...form.register("id")} defaultValue={collection.id} />

          <dl className="divide-y divide-gray-4">
            <CollectionNameField edit={edit} collection={collection} />
          </dl>
        </DetailPanel>
      </form>
    </Form>
  )
}

function CollectionNameField({ edit, collection }: { edit: boolean; collection: CollectionType }) {
  const form = useFormContext()
  if (!collection) return null
  return (
    <FormField
      control={form.control}
      name="name"
      defaultValue={collection.name ?? undefined}
      render={({ field }) => (
        <FormItem>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-slate-12">Name</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-11 sm:col-span-2 sm:mt-0">
              <FormControl>{!edit ? <div className="py-1.5">{collection.name ?? "--"}</div> : <Input {...field} />}</FormControl>
            </dd>
          </div>
        </FormItem>
      )}
    />
  )
}
