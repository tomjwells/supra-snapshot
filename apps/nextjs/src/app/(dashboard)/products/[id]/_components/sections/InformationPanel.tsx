"use client"

import React, { useTransition } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@acme/shadcn/form"
import { EditButtons } from "@acme/ui"
import EditImageItem from "@acme/ui/Forms/EditImageItem"
import { Input } from "@acme/ui/Forms/Input"
import DetailPanel from "@acme/ui/List/[id]/DetailPanel"
import { Prisma } from "@prisma/client"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon, DividerHorizontalIcon } from "@radix-ui/react-icons"
import { Checkbox, Flex, Grid } from "@radix-ui/themes"
import { useForm, useFormContext } from "react-hook-form"
import type z from "zod"

import { updateProductAction } from "~/_actions/products"
import { copyVariantInformationAction } from "~/_actions/variants"
import type { CurrenciesType } from "~/_backend/currencies"
import type { ProductType, updateProductSchema } from "~/_backend/products"
import CopyInformationAlertDialog from "~/app/(dashboard)/collections/[id]/variants/[variantId]/_components/CopyInformationAlertDialog"
import { Price } from "~/utils/ClientPrice"
import AmountAndCurrencyInput from "./AmountAndCurrencyInput"

export default function InformationPanel({
  product,
  currencies,
  currenciesIncludingFiat,
}: {
  product: ProductType
  currencies: CurrenciesType
  currenciesIncludingFiat: CurrenciesType
}) {
  const [isLoading, startTransition] = useTransition()
  const [edit, setEdit] = React.useState(false)
  const formAttribute = "hook-form"
  const form = useForm<z.infer<typeof updateProductSchema>>({
    defaultValues: {
      id: product?.id,
      imageData: "",
    },
  })

  const [selectAllState, setSelectAllState] = React.useState<boolean | "indeterminate">(
    product?.acceptedCurrencies?.length === 0 ? false : product?.acceptedCurrencies?.length === currencies.length ? true : "indeterminate",
  )

  React.useEffect(() => {
    if (product && !product.name) {
      setEdit(true)
    }
  }, [product])
  React.useEffect(() => {
    if (form.getValues("acceptedCurrencies")) {
      setSelectAllState(
        form.getValues("acceptedCurrencies")?.length === 0
          ? false
          : form.getValues("acceptedCurrencies")?.length === currencies.length
          ? true
          : "indeterminate",
      )
    }
  }, [currencies.length, form, form.watch("acceptedCurrencies")])

  const onSubmit = form.handleSubmit((data: z.infer<typeof updateProductSchema>) => {
    startTransition(async () => {
      while (form.getValues("imageData") === "compressing") {
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
      console.log("submitted:", data)
      const updatedProduct = await updateProductAction({ ...data, imageData: form.getValues("imageData") })
      if (updatedProduct) {
        setEdit(false)
      }
    })
  })

  if (!product) return null

  return (
    <Form {...form}>
      <form id={formAttribute} onSubmit={onSubmit}>
        <DetailPanel
          title="Product Information"
          subtitle="Add details for your product."
          fullWidth
          RightHeadingActions={
            <EditButtons
              edit={edit}
              setEdit={setEdit}
              isLoading={isLoading}
              formAttribute={formAttribute}
              variantAction={
                product.variantId && (
                  <CopyInformationAlertDialog action={copyVariantInformationAction.bind(null, product.variantId).bind(null, "Product Information")} />
                )
              }
            />
          }
        >
          <dl className="divide-y divide-gray-4">
            <ProductNameField edit={edit} product={product} />
            <ProductDescriptionField edit={edit} product={product} />

            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="py-1.5 text-sm font-medium text-slate-12">Image</dt>
              <dd className="mt-1 flex items-center gap-x-8 text-sm leading-6 text-gray-11 sm:col-span-2 sm:mt-0">
                <EditImageItem edit={edit} image={product.image} alt={product.name} style="square" fallbackIcon="CubeIcon" />
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="py-1.5 text-sm font-medium text-slate-12">Price</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-11 sm:col-span-2 sm:mt-0">
                {!edit ? (
                  <div className="flex flex-row justify-between py-1.5">
                    <Price network={product.Environment.network} symbol={product.currency.symbol || product.currency.ticker + " "} price={product.price} />
                  </div>
                ) : (
                  <AmountAndCurrencyInput
                    amountField="price"
                    environment={product.Environment}
                    defaultAmount={product.price ? new Prisma.Decimal(product.price).toNumber() : undefined}
                    defaultCurrencyId={product.currencyId ?? undefined}
                    currenciesIncludingFiat={currenciesIncludingFiat}
                  />
                )}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="py-1.5 text-sm font-medium text-slate-12">Accepted Tokens</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-11 sm:col-span-2 sm:mt-0">
                {!edit ? (
                  <div className="flex flex-row justify-between py-1.5">
                    {product.acceptedCurrencies.length === 0
                      ? "None"
                      : product.acceptedCurrencies.length >= currencies.length
                      ? "All"
                      : product.acceptedCurrencies.map((c) => c.ticker).join(", ")}
                  </div>
                ) : (
                  <span className="flex flex-row justify-between pt-6">
                    <Grid columns="2" gap="3" width="100%">
                      <ShadCnMultiCheckboxForm product={product} currencies={currencies} />

                      <Flex asChild gap="3">
                        <FormItem className="flex flex-row items-start space-x-1 space-y-0">
                          <TriStateCheckbox selectAllState={selectAllState} currencies={currencies} />
                          <FormLabel className="font-normal">Select/Deselect All</FormLabel>
                        </FormItem>
                      </Flex>
                    </Grid>
                  </span>
                )}
              </dd>
            </div>
          </dl>
        </DetailPanel>
      </form>
    </Form>
  )
}

function ProductNameField({ edit, product }: { edit: boolean; product: NonNullable<ProductType> }) {
  const form = useFormContext()
  return (
    <FormField
      control={form.control}
      name="name"
      defaultValue={product.name ?? ""}
      render={({ field }) => (
        <FormItem>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-slate-12">Name</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-11 sm:col-span-2 sm:mt-0">
              <FormControl>{!edit ? <div className="py-1.5">{product.name ?? "--"}</div> : <Input {...field} />}</FormControl>
            </dd>
          </div>
        </FormItem>
      )}
    />
  )
}

function ProductDescriptionField({ edit, product }: { edit: boolean; product: NonNullable<ProductType> }) {
  const form = useFormContext()

  return (
    <FormField
      control={form.control}
      name="description"
      defaultValue={product.description ?? ""}
      render={({ field }) => (
        <FormItem>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="py-1.5 text-sm font-medium text-slate-12">Description</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-11 sm:col-span-2 sm:mt-0">
              <FormControl>
                {!edit ? <div className="whitespace-pre-line py-1.5">{product.description ?? "--"}</div> : <Input {...field} rows={3} />}
              </FormControl>
            </dd>
          </div>
        </FormItem>
      )}
    />
  )
}

export function ShadCnMultiCheckboxForm({ product, currencies }: { product: ProductType; currencies: CurrenciesType }) {
  const form = useFormContext()

  return (
    <Flex direction="column" gap="2">
      {currencies.map((c) => (
        <FormField
          key={c.id}
          control={form.control}
          defaultValue={product?.acceptedCurrencies.map((c) => ({
            id: c.id,
          }))}
          name="acceptedCurrencies"
          render={({ field }) => {
            return (
              <FormItem key={c.id} className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value?.map((c_prime: { id: string }) => c_prime.id).includes(c.id)}
                    onCheckedChange={(checked) => {
                      return checked ? field.onChange([...field.value, { id: c.id }]) : field.onChange(field.value?.filter((value) => value.id !== c.id))
                    }}
                  />
                </FormControl>
                <FormLabel className="font-normal">{c.ticker}</FormLabel>
              </FormItem>
            )
          }}
        />
      ))}
    </Flex>
  )
}

export function TriStateCheckbox({ selectAllState, currencies }: { selectAllState: boolean | "indeterminate"; currencies: CurrenciesType }) {
  const methods = useFormContext()

  return (
    <span className="rt-CheckboxRoot rt-r-size-2">
      <CheckboxPrimitive.Root
        tabIndex={-1}
        checked={selectAllState}
        onCheckedChange={(checked) => {
          if (checked === "indeterminate") return
          if (checked) {
            methods.setValue(
              "acceptedCurrencies",
              currencies.map((c) => ({ id: c.id })),
            )
          } else {
            methods.setValue("acceptedCurrencies", [])
          }
        }}
        className="rt-reset rt-CheckboxButton rt-variant-surface"
      >
        <CheckboxPrimitive.Indicator className="rt-CheckboxIndicator rounded-[var(--radius-1)] bg-[var(--accent-9)] text-[var(--accent-9-contrast)]">
          {selectAllState === "indeterminate" && <DividerHorizontalIcon className="rt-CheckboxIndicatorIcon" fill="curentColor" />}
          {selectAllState === true && <CheckIcon />}
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    </span>
  )
}
