"use client"

import React, { useTransition } from "react"
import type { Country, Environment } from "@acme/db"
import { CurrencyType, Region } from "@acme/db"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@acme/shadcn/form"
import { EditButtons, Input } from "@acme/ui"
import TooltipPopover from "@acme/ui/TooltipPopover"
import { Box, Checkbox, Flex, Select, Text } from "@radix-ui/themes"
import { useForm } from "react-hook-form"
import type z from "zod"

import { updateTierAction } from "~/_actions/shippingPolicies"
import type { CurrenciesType } from "~/_backend/currencies"
import type { ShippingPolicyType, updateTierSchema } from "~/_backend/shippingPolicies"
import { Price } from "~/utils/ClientPrice"
import { EllipsesMenu } from "./EllipsesMenu"
import FancyMultiSelect from "./FancyMultiSelect"

export default function Tier({
  environment,
  shippingPolicy,
  tier,
  index,
  currenciesIncludingFiat,
  countries,
}: {
  environment: Environment
  shippingPolicy: NonNullable<ShippingPolicyType>
  tier: NonNullable<ShippingPolicyType>["ShippingPolicyZone"][number]
  index: number
  currenciesIncludingFiat: CurrenciesType
  countries: Country[]
}) {
  const [edit, setEdit] = React.useState(tier.countries.length === 0)
  const [isLoading, startTransition] = useTransition()

  const form = useForm<z.infer<typeof updateTierSchema>>({
    defaultValues: {
      ...tier,
      price: parseFloat(tier.price.toString()), 
      each_additional: parseFloat(tier.each_additional.toString()),
    },
  })

  const onSubmit = form.handleSubmit((data: z.infer<typeof updateTierSchema>) => {
    startTransition(async () => {
      console.log("submitted:", data)
      const updatedTier = await updateTierAction(data)
      if (updatedTier) {
        setEdit(false)
      }
    })
  })

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-slate-12">Zone {index + 1}</dt>
          <dd className="mt-1 text-sm leading-6 text-gray-11 sm:col-span-2 sm:mt-0">
            <div className="flex w-full flex-row justify-end gap-2">
              <EditButtons setEdit={setEdit} edit={edit} isLoading={isLoading} />
              <EllipsesMenu tierId={tier.id} />
            </div>
          </dd>
          {edit ? (
            <div className="col-span-3 px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-slate-12">Countries</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-11 sm:col-span-2 sm:mt-0">
                <Box width="100%">
                  <Flex gap="2" direction="column" mb="4">
                    {Object.entries(Region).map(([region, _]) => (
                      <FormItem key={region} className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            onCheckedChange={(checked) => {
                              if (checked) {
                                form.setValue("countries", [
                                  ...form.getValues("countries"),
                                  ...countries
                                    .filter(
                                      (c) =>
                                        form
                                          .getValues("countries")
                                          .map((c) => c.code)
                                          .includes(c.code) === false,
                                    )
                                    .filter((c) => c.region === region),
                                ])
                              } else {
                                form.setValue(
                                  "countries",
                                  form.getValues("countries").filter((c) => c.region !== region),
                                )
                              }
                            }}
                            checked={
                              form.getValues("countries").filter((c) => c.region === region).length === countries.filter((c) => c.region === region).length
                            }
                          />
                        </FormControl>
                        <FormLabel className="font-normal capitalize">{_.replace("_", " ").toLowerCase()}</FormLabel>
                      </FormItem>
                    ))}
                  </Flex>
                  <FancyMultiSelect countries={countries} otherTiers={shippingPolicy.ShippingPolicyZone.filter((t) => t.id !== tier.id)} />
                </Box>
              </dd>
              <dt className="text-sm font-medium text-slate-12">Price</dt>
              <dd className="mt-1 flex flex-row items-center justify-between text-sm leading-6 text-gray-11 sm:col-span-2 sm:mt-0">
                <Select.Root defaultValue={tier.currencyId ?? undefined} onValueChange={(value) => form.setValue("currencyId", value)}>
                  <Select.Trigger />
                  <Select.Content>
                    <Select.Group>
                      <Select.Label>Fiat</Select.Label>
                      {currenciesIncludingFiat
                        .filter((currency) => currency.type === CurrencyType.FIAT)
                        .map((currency) => (
                          <Select.Item key={currency.id} value={currency.id}>
                            {currency.label} ({currency.ticker})
                          </Select.Item>
                        ))}
                    </Select.Group>
                    <Select.Group>
                      <Select.Label>Crypto</Select.Label>
                      {currenciesIncludingFiat
                        .filter((currency) => currency.type === CurrencyType.CRYPTO)
                        .map((currency) => (
                          <Select.Item key={currency.id} value={currency.id}>
                            {currency.label} ({currency.ticker})
                          </Select.Item>
                        ))}
                    </Select.Group>
                  </Select.Content>
                </Select.Root>
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-x-2 space-y-0">
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        {!edit ? (
                          <div className="py-1.5">{shippingPolicy.name ?? "--"}</div>
                        ) : (
                          <Input min={0} pattern="^\d*(\.\d{0,8})?$" {...field} className="w-48" />
                        )}
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="each_additional"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-x-2  space-y-0">
                      <FormLabel>Each Additional</FormLabel>
                      <FormControl>
                        {!edit ? (
                          <div className="py-1.5">{shippingPolicy.name ?? "--"}</div>
                        ) : (
                          <Input min={0} pattern="^\d*(\.\d{0,8})?$" {...field} className="w-48" />
                        )}
                      </FormControl>
                    </FormItem>
                  )}
                />
              </dd>
            </div>
          ) : (
            <div className="col-span-3 px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-slate-12">Countries</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-11 sm:col-span-2 sm:mt-0">
                <Text color="gray">{tier.countries.length > 0 ? tier.countries.map((country) => country.name).join(", ") : "None"}</Text>
              </dd>
              <dt className="text-sm font-medium text-slate-12">Price</dt>
              <dd className="mt-1 flex flex-row items-center justify-between  gap-4 text-sm leading-6 text-gray-11 sm:col-span-2 sm:mt-0">
                <Text color="gray" className="w-full">
                  {tier.price ? (
                    <Price price={tier.price} symbol={tier.currency.symbol ?? tier.currency.ticker} network={environment.network} precision={10} />
                  ) : (
                    "--"
                  )}
                </Text>
                <Flex className="flex flex-row items-center" gap="2">
                  <Text color="gray" className="w-full whitespace-nowrap">
                    Each Additional:
                  </Text>
                  <TooltipPopover text="Set an incremental shipping cost for each additional item following the first item." />
                </Flex>
                <Text color="gray" className="w-full">
                  {tier.each_additional ? (
                    <Price price={tier.each_additional} symbol={tier.currency.symbol ?? tier.currency.ticker} network={environment.network} precision={10} />
                  ) : (
                    "--"
                  )}
                </Text>
              </dd>
            </div>
          )}
        </div>
      </form>
    </Form>
  )
}
