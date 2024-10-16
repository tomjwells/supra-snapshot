import React from "react"
import { redirect } from "next/navigation"
import { DetailField } from "@acme/ui/List/[id]/DetailField"
import DetailPanel from "@acme/ui/List/[id]/DetailPanel"
import type { CustomerPaymentPhysicalAddress } from "@prisma/client"
import { Flex, Heading, Text } from "@radix-ui/themes"

import { getCustomerByPaymentId } from "~/_backend/customers"
import type { PaymentType } from "~/_backend/payments"
import { getPayment } from "~/_backend/payments"
import { getProduct } from "~/_backend/products"
import { auth } from "~/utils/auth"

export default async function CustomerInformation({ id }: { id: string }) {
  const payment = await getPayment(id, (await auth()).user.selectedEnvironmentId)
  const product = await getProduct(payment?.productId ?? "")
  const customer = await getCustomerByPaymentId(id)
  if (!payment) return redirect(`/payments`)
  const postalAddress = payment.CustomerPaymentPhysicalAddress
  const customerCustomInformation = payment.customerCustomInformation

  return (
    <DetailPanel
      title="Customer Information"
      fullWidth
    >
      <form>
        <dl className="divide-y divide-gray-4">
          {customer && (
            <>
              <DetailField label="Customer ID" value={customer.id || "--"} />
              <DetailField label="Email" value={customer.email || "--"} />
            </>
          )}
          <DetailField label="Payment Address" value={payment.customerData_paymentAddress || "--"} />
          {postalAddress && <PostalAddress postalAddress={postalAddress} />}
          {customerCustomInformation.length > 0 && <CustomerCustomInformation customerCustomInformation={customerCustomInformation} />}
          {product?.quantity_variable && <ItemQuantity payment={payment} />}
        </dl>
      </form>
    </DetailPanel>
  )
}

function PostalAddress({ postalAddress }: { postalAddress: CustomerPaymentPhysicalAddress }) {
  return (
    <DetailField
      label="Postage Address"
      value={
        <>
          <div>
            {postalAddress.firstName} {postalAddress.lastName}
          </div>
          <div>{postalAddress.line1}</div>
          <div>{postalAddress.line2}</div>
          <div>{postalAddress.city}</div>
          <div>{postalAddress.StateProvinceCounty}</div>
          <div>{postalAddress.ZipOrPostcode}</div>
          <div>{postalAddress.country}</div>
        </>
      }
    />
  )
}

function CustomerCustomInformation({ customerCustomInformation }: { customerCustomInformation: NonNullable<PaymentType>["customerCustomInformation"] }) {
  return (
    <DetailField
      label="Custom Information"
      value={
        <Flex direction="column" gap="4">
          {customerCustomInformation.map((info) => {
            return (
              <Flex direction="column" key={info.id}>
                <Heading as="h4" size="2" weight="medium" className="text-gray-12">
                  {info.request}
                </Heading>
                <Text as="p" size="2" className="whitespace-pre text-gray-11">
                  {info.response}
                </Text>
              </Flex>
            )
          })}
        </Flex>
      }
    />
  )
}
function ItemQuantity({ payment }: { payment: NonNullable<PaymentType> }) {
  return (
    <DetailField
      label="Item Quantity"
      value={
        <Flex direction="column" gap="4">
          <Text as="p" size="2" className="whitespace-pre text-gray-11">
            {payment.item_quantity}
          </Text>
        </Flex>
      }
    />
  )
}
