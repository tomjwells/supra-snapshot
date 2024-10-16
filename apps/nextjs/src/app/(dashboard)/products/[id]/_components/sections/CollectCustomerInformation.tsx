"use client"

import React from "react"
import { CustomInformationFieldType } from "@acme/db"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@acme/shadcn/form"
import { EditButtons, EllipsesMenuTrigger } from "@acme/ui"
import CheckboxField from "@acme/ui/Forms/CheckboxField"
import GenericFormField from "@acme/ui/Forms/GenericFormField"
import { Input } from "@acme/ui/Forms/Input"
import SelectableField from "@acme/ui/Forms/SelectableField"
import SwitchField from "@acme/ui/Forms/SwitchField"
import DetailPanel from "@acme/ui/List/[id]/DetailPanel"
import { PlusIcon } from "@radix-ui/react-icons"
import { Button, DropdownMenu, Flex, Heading, RadioGroup, Text } from "@radix-ui/themes"
import { useForm, useFormContext } from "react-hook-form"
import type z from "zod"

import { updateProductAction } from "~/_actions/products"
import { copyVariantInformationAction } from "~/_actions/variants"
import type { ProductType, updateProductSchema } from "~/_backend/products"
import { ShippingPolicyType } from "~/_backend/shippingPolicies"
import CopyInformationAlertDialog from "~/app/(dashboard)/collections/[id]/variants/[variantId]/_components/CopyInformationAlertDialog"

export default function CollectCustomerInformation({
  product,
  shippingPolicies,
}: {
  product: ProductType
  shippingPolicies: NonNullable<ShippingPolicyType>[]
}) {
  const [isLoading, startTransition] = React.useTransition()
  const [edit, setEdit] = React.useState(false)

  const form = useForm<z.infer<typeof updateProductSchema>>({
    defaultValues: {
      collect_email: product?.collect_email,
      collect_address: product?.collect_address,
      collect_custom_information: product?.collect_custom_information,
      shippingPolicyId: product?.shippingPolicyId ?? undefined,
    },
  })
  const formAttribute = "hook-form-customer-information"

  if (!product) return null

  const onSubmit = form.handleSubmit((data: z.infer<typeof updateProductSchema>) => {
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
      title="Customer Information"
      subtitle="Choose which customer information to collect at checkout."
      RightHeadingActions={
        <EditButtons
          edit={edit}
          setEdit={setEdit}
          isLoading={isLoading}
          formAttribute={formAttribute}
          variantAction={
            product.variantId && (
              <CopyInformationAlertDialog action={copyVariantInformationAction.bind(null, product.variantId).bind(null, "Customer Information")} />
            )
          }
        />
      }
    >
      <Form {...form}>
        <form id={formAttribute} onSubmit={onSubmit}>
          <input type="hidden" {...form.register("id")} defaultValue={product.id} />
          <Flex direction="column" gap="5">
            <SwitchField
              title="Email address"
              subtitle="Collect the customer's email address at checkout."
              checked={form.watch("collect_email") ?? false}
              onCheckedChange={(e) => form.setValue("collect_email", e)}
              disabled={!edit}
            />
            <SwitchField
              title="Shipping Address"
              subtitle="Collect the customer's shipping address at checkout."
              checked={form.watch("collect_address") ?? false}
              onCheckedChange={(e) => form.setValue("collect_address", e)}
              disabled={!edit}
            />
            <SelectableField
              title="Postage & Packaging"
              subtitle="Add postage and packaging cost, based on the customer's location."
              tooltip="Shipping policies can be added from the Shipping Policies section of the website."
              defaultValue={form.watch("shippingPolicyId") ?? false}
              onChange={(e) => form.setValue("shippingPolicyId", e)}
              disabled={!edit}
              edit={edit}
              options={shippingPolicies.map((policy) => ({ id: policy.id, name: policy.name }))}
              href={`/shipping-policies/${form.watch("shippingPolicyId") ?? product.shippingPolicyId}`}
            />

            <GenericFormField title="Custom Information" subtitle="Request additional information from the customer at checkout.">
              <Flex direction="column" gap={edit ? "6" : "4"}>
                {!edit && form.watch("collect_custom_information")?.length === 0 && <Text color="gray">None</Text>}
                {!edit &&
                  form.watch("collect_custom_information")?.map((item, index: number) => (
                    <Flex direction="column" gap="2" align="start" justify="center" key={index}>
                      <Heading size="2" color="gray">
                        Question {index + 1}
                      </Heading>
                      <Text size="2" color="gray">
                        {item.request}
                      </Text>
                    </Flex>
                  ))}
                {edit && form.watch("collect_custom_information")?.length === 0 && <Text color="gray">None</Text>}
                {edit &&
                  form.watch("collect_custom_information")?.map((item, index: number) => (
                    <Flex direction="column" gap="2" key={index}>
                      <Flex direction="row" width="100%" justify="between">
                        <Heading size="2">Question {index + 1}</Heading>
                        <EllipsesMenu id={item?.id ?? ""} />
                      </Flex>
                      <input
                        type="hidden"
                        {...form.register(`collect_custom_information.${index}.orderIndex`, {
                          valueAsNumber: true,
                        })}
                        defaultValue={index}
                      />
                      <CollectCustomInformationRequestField index={index} item={form.watch(`collect_custom_information.${index}`)} />
                      <Heading size="2" mt="2">
                        Input type
                      </Heading>
                      <RadioGroup.Root
                        defaultValue={form.watch(`collect_custom_information.${index}.field_type`)}
                        onChange={(e) => {
                          console.log("onChange")
                          console.log(e)
                          form.setValue(`collect_custom_information.${index}.field_type`, (e.target as HTMLInputElement).value, { shouldValidate: true })
                        }}
                      >
                        <Flex gap="6" direction="row" justify="start">
                          <Text as="label" size="2">
                            <Flex gap="2">
                              <RadioGroup.Item value={CustomInformationFieldType.INPUT} /> Single line
                            </Flex>
                          </Text>
                          <Text as="label" size="2">
                            <Flex gap="2">
                              <RadioGroup.Item value={CustomInformationFieldType.TEXTAREA} /> Multiple lines
                            </Flex>
                          </Text>
                        </Flex>
                      </RadioGroup.Root>
                    </Flex>
                  ))}
                {edit && (
                  <Flex justify="end">
                    <Button
                      className="!text-sm !font-semibold !text-slate-12 !shadow-sm !ring-1 !ring-inset !ring-slate-7 hover:!bg-gray-2 dark:!bg-slate-1 "
                      variant="outline"
                      highContrast
                      onClick={(e) => {
                        e.preventDefault()
                        form.setValue("collect_custom_information", [
                          ...form.watch("collect_custom_information"),
                          {
                            id: Math.random().toString(),
                            request: "",
                            field_type: CustomInformationFieldType.INPUT,
                          },
                        ])
                      }}
                    >
                      <PlusIcon width="16" height="16" /> Add Question
                    </Button>
                  </Flex>
                )}
              </Flex>
            </GenericFormField>
            <CheckboxField
              title="Variable Quantity"
              subtitle="Allow customers to select a quantity at checkout."
              registerName="quantity_variable"
              defaultValue={product.quantity_variable}
              disabled={!edit}
            />
            {(edit
              ? form.watch("quantity_variable") !== undefined
                ? form.watch("quantity_variable")
                : product.quantity_variable
              : product.quantity_variable) && (
              <>
                <MinimumQuantityField edit={edit} product={product} />
                <MaximumQuantityField edit={edit} product={product} />
              </>
            )}
          </Flex>
        </form>
      </Form>
    </DetailPanel>
  )
}

function CollectCustomInformationRequestField({ index, item }: { index: number; item: NonNullable<ProductType>["collect_custom_information"][number] }) {
  const form = useFormContext()
  return (
    <FormField
      control={form.control}
      name={`collect_custom_information.${index}.request`}
      defaultValue={item.request}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Question text</FormLabel>
          <FormControl>
            <Input placeholder="Please enter..." {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export function EllipsesMenu({ id }: { id: string }) {
  const form = useFormContext()
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <EllipsesMenuTrigger />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item
          color="red"
          onClick={() =>
            form.setValue(
              "collect_custom_information",
              form.watch("collect_custom_information").filter((item) => item.id !== id),
            )
          }
        >
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

function MinimumQuantityField({ edit, product }: { edit?: boolean; product: NonNullable<ProductType> }) {
  const form = useFormContext()
  return (
    <FormField
      control={form.control}
      name="quantity_minimum"
      defaultValue={product.quantity_minimum}
      rules={{
        required: true,
        min: 1,
      }}
      render={({ field }) => (
        <FormItem>
          <dl className="divide-y divide-gray-4">
            <div className="sm:grid sm:grid-cols-2 sm:gap-4 ">
              <dt className="py-1.5 text-sm font-medium text-slate-12">Minimum Quantity</dt>
              <dd className="mt-1 w-24 text-sm leading-6 text-gray-11 sm:col-span-1 sm:mt-0">
                <FormControl>
                  {!edit ? (
                    <div className="flex flex-row justify-between py-1.5">{product.quantity_minimum}</div>
                  ) : (
                    <Input type="number" {...field} onChange={(event) => field.onChange(+event.target.value)} min="1" />
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
function MaximumQuantityField({ edit, product }: { edit?: boolean; product: NonNullable<ProductType> }) {
  const form = useFormContext()
  return (
    <FormField
      control={form.control}
      name="quantity_maximum"
      defaultValue={product.quantity_maximum}
      rules={{
        required: true,
        min: 1,
      }}
      render={({ field }) => (
        <FormItem>
          <dl className="divide-y divide-gray-4">
            <div className="sm:grid sm:grid-cols-2 sm:gap-4 ">
              <dt className="py-1.5 text-sm font-medium text-slate-12">Maximum Quantity</dt>
              <dd className="mt-1 w-24 text-sm leading-6 text-gray-11 sm:col-span-1 sm:mt-0">
                <FormControl>
                  {!edit ? (
                    <div className="flex flex-row justify-between py-1.5">{product.quantity_maximum}</div>
                  ) : (
                    <Input type="number" {...field} onChange={(event) => field.onChange(+event.target.value)} min="1" />
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
