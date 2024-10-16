"use client"

import React, { useTransition } from "react"
import { Form, FormControl, FormField, FormItem } from "@acme/shadcn/form"
import { EditButtons } from "@acme/ui"
import { Input } from "@acme/ui/Forms/Input"
import DetailPanel from "@acme/ui/List/[id]/DetailPanel"
import { useForm, useFormContext } from "react-hook-form"
import type z from "zod"

import { updateShippingPolicyAction } from "~/_actions/shippingPolicies"
import type { ShippingPolicyType, updateShippingPolicySchema } from "~/_backend/shippingPolicies"

export default function InformationPanel({ shippingPolicy }: { shippingPolicy: ShippingPolicyType }) {
  const [isLoading, startTransition] = useTransition()
  const [edit, setEdit] = React.useState(false)
  const formAttribute = "hook-form"
  const form = useForm<z.infer<typeof updateShippingPolicySchema> & { imageData: string }>({
    defaultValues: {
      id: shippingPolicy?.id,
      name: shippingPolicy?.name ?? "",
      imageData: "compressing",
    },
  })

  React.useEffect(() => {
    if (shippingPolicy && !shippingPolicy.name) {
      setEdit(true)
    }
  }, [shippingPolicy])

  const onSubmit = form.handleSubmit((data: z.infer<typeof updateShippingPolicySchema>) => {
    startTransition(async () => {
      console.log("submitted:", data)
      const updatedShippingPolicy = await updateShippingPolicyAction(data)
      if (updatedShippingPolicy) {
        setEdit(false)
      }
    })
  })

  if (!shippingPolicy) return null

  return (
    <Form {...form}>
      <form id={formAttribute} onSubmit={onSubmit}>
        <DetailPanel
          title="Shipping Policy Information"
          subtitle="Add basic information for your Shipping Policy."
          fullWidth
          RightHeadingActions={<EditButtons edit={edit} setEdit={setEdit} isLoading={isLoading} formAttribute={formAttribute} />}
        >
          <dl className="divide-y divide-gray-4">
            <ProductNameField edit={edit} shippingPolicy={shippingPolicy} />
          </dl>
        </DetailPanel>
      </form>
    </Form>
  )
}

function ProductNameField({ edit, shippingPolicy }: { edit: boolean; shippingPolicy: NonNullable<ShippingPolicyType> }) {
  const form = useFormContext<z.infer<typeof updateShippingPolicySchema> & { imageData: string }>()
  return (
    <FormField
      control={form.control}
      name="name"
      defaultValue={shippingPolicy.name ?? ""}
      render={({ field }) => (
        <FormItem>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-slate-12">Name</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-11 sm:col-span-2 sm:mt-0">
              <FormControl>{!edit ? <div className="py-1.5">{shippingPolicy.name ?? "--"}</div> : <Input {...field} />}</FormControl>
            </dd>
          </div>
        </FormItem>
      )}
    />
  )
}
