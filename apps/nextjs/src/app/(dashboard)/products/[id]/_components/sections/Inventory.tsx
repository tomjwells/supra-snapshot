"use client"

import React, { useTransition } from "react"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@acme/shadcn/form"
import { EditButtons } from "@acme/ui"
import CheckboxField from "@acme/ui/Forms/CheckboxField"
import { Input } from "@acme/ui/Forms/Input"
import DetailPanel from "@acme/ui/List/[id]/DetailPanel"
import { Flex } from "@radix-ui/themes"
import { useForm, useFormContext } from "react-hook-form"
import type { z } from "zod"

import { updateProductAction } from "~/_actions/products"
import { copyVariantInformationAction } from "~/_actions/variants"
import type { ProductType, updateProductSchema } from "~/_backend/products"
import CopyInformationAlertDialog from "~/app/(dashboard)/collections/[id]/variants/[variantId]/_components/CopyInformationAlertDialog"

export default function Inventory({ product }: { product: ProductType }) {
  const [isLoading, startTransition] = useTransition()

  const [edit, setEdit] = React.useState(false)
  const formAttribute = "inventory-form"
  const form = useForm<z.infer<typeof updateProductSchema>>({
    defaultValues: {
      id: product?.id ?? "",
    },
  })

  const onSubmit = form.handleSubmit((data) => {
    startTransition(async () => {
      console.log("submitted:", data)
      const updatedProduct = await updateProductAction(data)
      if (updatedProduct) {
        setEdit(false)
      }
    })
  })

  if (!product) return null
  return (
    <DetailPanel
      title="Inventory"
      subtitle="Keep track of the amount of stock you have available."
      RightHeadingActions={
        <EditButtons
          edit={edit}
          setEdit={setEdit}
          isLoading={isLoading}
          formAttribute={formAttribute}
          variantAction={
            product.variantId && <CopyInformationAlertDialog action={copyVariantInformationAction.bind(null, product.variantId).bind(null, "Inventory")} />
          }
        />
      }
    >
      <Form {...form}>
        <form id={formAttribute} onSubmit={onSubmit}>
          <Flex direction="column" gap="5">
            <input type="hidden" {...form.register("id")} defaultValue={product.id} />

            <CheckboxField title="Track Inventory" registerName="inventory_track" defaultValue={product.inventory_track} disabled={!edit} />
            {(edit ? (form.watch("inventory_track") !== undefined ? form.watch("inventory_track") : product.inventory_track) : product.inventory_track) && (
              <>
                <InventoryQuantityField edit={edit} product={product} />
                <CheckboxField
                  title="Continue Selling when Out of Stock"
                  registerName="inventory_continueSelling"
                  defaultValue={product.inventory_continueSelling}
                  disabled={!edit}
                />
              </>
            )}
          </Flex>
        </form>
      </Form>
    </DetailPanel>
  )
}

function InventoryQuantityField({ edit, product }: { edit?: boolean; product: NonNullable<ProductType> }) {
  const form = useFormContext()
  return (
    <FormField
      control={form.control}
      name="inventory_quantity"
      defaultValue={product.inventory_quantity}
      rules={{
        required: true,
        min: 0,
      }}
      render={({ field }) => (
        <FormItem>
          <dl className="divide-y divide-gray-4">
            <div className="sm:grid sm:grid-cols-2 sm:gap-4 ">
              <dt className="py-1.5 text-sm font-medium text-slate-12">Quantity</dt>
              <dd className="mt-1 w-24 text-sm leading-6 text-gray-11 sm:col-span-1 sm:mt-0">
                <FormControl>
                  {!edit ? (
                    <div className="flex flex-row justify-between py-1.5">{product.inventory_quantity}</div>
                  ) : (
                    <Input type="number" {...field} onChange={(event) => field.onChange(+event.target.value)} />
                  )}
                </FormControl>
                <FormMessage />
              </dd>
            </div>
          </dl>
        </FormItem>
      )}
    />
  )
}
