"use client"

import { Network } from "@acme/db"
import { formatNumber } from "@acme/utils"
import { Button, Dialog, Flex, Heading, Link, Text } from "@radix-ui/themes"
import { useFormContext } from "react-hook-form"
import type { z } from "zod"

import type { ProductType } from "~/_backend/products"
import type { checkoutFormSchema } from "~/app/[id]/_providers/CheckoutFormProvider"
import SubHeading from "../SubHeading"

export default function AmountDue({
  product,
  selectedCurrency,
}: {
  product: ProductType
  selectedCurrency: NonNullable<ProductType>["acceptedCurrencies"][number]
}) {
  const form = useFormContext<z.infer<typeof checkoutFormSchema>>()
  if (!product) return null

  return (
    <Flex direction="column">
      {product.shippingPolicyId && form.watch("country") && <OrderSummary product={product} selectedCurrency={selectedCurrency} />}
      {!(product.shippingPolicyId && form.watch("country")) && (
        <>
          <SubHeading>Amount due </SubHeading>
          <Heading
            size={{ initial: "5", sm: "6", md: "7" }}
            className="mt-1 font-bold text-white"
            style={{
              fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            }}
          >
            <TotalPrice product={product} selectedCurrency={selectedCurrency} />
          </Heading>
        </>
      )}
      {
        product.shippingPolicyId && !form.watch("country") && (
          <Link color="gray" mt="3">
            + Shipping
          </Link>
        )
      }
    </Flex>
  )
}
function OrderSummary({
  product,
  selectedCurrency,
}: {
  product: NonNullable<ProductType>
  selectedCurrency: NonNullable<ProductType>["acceptedCurrencies"][number]
}) {
  return (
    <dl className="space-y-6  py-6 text-sm font-medium text-gray-500">
      <SubHeading>Order Summary</SubHeading>
      <div className="flex items-center justify-between">
        <dt className="text-sm text-gray-11">Subtotal</dt>
        <dd className="text-sm font-medium text-gray-12">
          <Price product={product} selectedCurrency={selectedCurrency} />
        </dd>
      </div>
      <div className="flex items-center justify-between">
        <dt className="text-sm text-gray-11">Shipping</dt>
        <dd className="text-sm font-medium text-gray-12">
          <ShippingPrice product={product} selectedCurrency={selectedCurrency} />
        </dd>
      </div>
      <div className="flex items-center justify-between border-t border-gray-800 pt-6">
        <dt className="text-base font-medium text-gray-12">Total</dt>
        <dd className="text-base font-medium text-white">
          <TotalPrice product={product} selectedCurrency={selectedCurrency} />
        </dd>
      </div>
    </dl>
  )
}

function getPrice(item_quantity: number, price: number, price_currency: number, selectedCurrency: number) {
  return item_quantity * price * (price_currency / selectedCurrency)
}
function getShippingPrice(item_quantity: number, price: number, each_additional: number, price_currency: number, selectedCurrency: number) {
  return price + (item_quantity - 1) * each_additional * (price_currency / selectedCurrency)
}

function Price({ product, selectedCurrency }: { product: NonNullable<ProductType>; selectedCurrency: NonNullable<ProductType>["acceptedCurrencies"][number] }) {
  const form = useFormContext<z.infer<typeof checkoutFormSchema>>()

  if (!product.price) return null

  const price =
    (product.Environment.network === Network.testnet ? "t" : "") +
    ((selectedCurrency.symbol || selectedCurrency.ticker + " ") +
      formatNumber(
        getPrice(
          form.watch("item_quantity"),
          parseFloat(product.price.toString()),
          parseFloat(product.currency.lastPrice.toString()),
          parseFloat(selectedCurrency.lastPrice.toString()),
        ),
        4,
      ))
  return <>{price}</>
}
function ShippingPrice({
  product,
  selectedCurrency,
}: {
  product: NonNullable<ProductType>
  selectedCurrency: NonNullable<ProductType>["acceptedCurrencies"][number]
}) {
  const form = useFormContext<z.infer<typeof checkoutFormSchema>>()
  const country = form.watch("country")

  const shippingZone = product.ShippingPolicy?.ShippingPolicyZone?.find((zone) => zone.countries.find((c) => c.code === country))
  if (!shippingZone) return null

  if (!product.price) return null

  const price =
    (product.Environment.network === Network.testnet ? "t" : "") +
    ((selectedCurrency.symbol || selectedCurrency.ticker + " ") +
      formatNumber(
        getShippingPrice(
          form.watch("item_quantity"),
          parseFloat(shippingZone?.price?.toString() ?? "0"),
          parseFloat(shippingZone?.each_additional?.toString() ?? "0"),
          parseFloat(shippingZone?.currency?.lastPrice.toString()),
          parseFloat(selectedCurrency.lastPrice.toString()),
        ),
        4,
      ))
  return <>{price}</>
}
function TotalPrice({
  product,
  selectedCurrency,
}: {
  product: NonNullable<ProductType>
  selectedCurrency: NonNullable<ProductType>["acceptedCurrencies"][number]
}) {
  const form = useFormContext<z.infer<typeof checkoutFormSchema>>()
  const country = form.watch("country")
  const shippingZone = product.ShippingPolicy?.ShippingPolicyZone?.find((zone) => zone.countries.find((c) => c.code === country))
  if (!product.price) return null

 
  const price =
    (product.Environment.network === Network.testnet ? "t" : "") +
    ((selectedCurrency.symbol || selectedCurrency.ticker + " ") +
      formatNumber(
        getPrice(
          form.watch("item_quantity"),
          parseFloat(product.price.toString()),
          parseFloat(product.currency.lastPrice.toString()),
          parseFloat(selectedCurrency.lastPrice.toString()),
        ) +
          getShippingPrice(
            form.watch("item_quantity"),
            parseFloat(shippingZone?.price?.toString() ?? "0"),
            parseFloat(shippingZone?.each_additional?.toString() ?? "0"),
            parseFloat(shippingZone?.currency?.lastPrice.toString() ?? "0"),
            parseFloat(selectedCurrency.lastPrice.toString()),
          ),
        4,
      ))

  return <>{price}</>
}
