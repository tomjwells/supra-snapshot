import React, { Suspense } from "react"
import { redirect } from "next/navigation"
import { DetailElement, DetailField, DetailLinkField } from "@acme/ui/List/[id]/DetailField"
import DetailPanel from "@acme/ui/List/[id]/DetailPanel"
import { explorerLink } from "@acme/utils"
import { PaymentStatus } from "@prisma/client"
import { Badge } from "@radix-ui/themes"

import { getPayment } from "~/_backend/payments"
import { auth } from "~/utils/auth"
import { Price } from "~/utils/ClientPrice"
import ProductField from "./ProductField"

export default async function PaymentInformation({ id }: { id: string }) {
  const payment = await getPayment(id, (await auth()).user.selectedEnvironmentId)
  if (!payment) return redirect(`/payments`)

  return (
    <DetailPanel
      title="Payment Information"
      fullWidth
    >
      <dl className="divide-y divide-gray-4">
        <DetailField label="Time" value={new Date(payment.createdAt).toLocaleDateString() + " " + new Date(payment.createdAt).toLocaleTimeString()} />
        <DetailField label="Payment ID" value={payment.id || "--"} />

        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="py-1.5 text-sm font-medium text-slate-12">Product</dt>
          <dd className="mt-1 flex items-center gap-x-8 text-sm leading-6 text-gray-11 sm:col-span-2 sm:mt-0">
            <Suspense>
              <ProductField productId={payment.productId} />
            </Suspense>
          </dd>
        </div>
        <DetailElement
          label="Status"
          element={
            <Badge
              className="capitalize"
              color={(payment.status === PaymentStatus.COMPLETE && "green") || (payment.status === PaymentStatus.PENDING && "yellow") || "gray"}
            >
              {payment.status.toLowerCase()}
            </Badge>
          }
        />
        {payment.shippingAmount.toNumber() > 0 && (
          <>
            <DetailField
              label="Subtotal"
              value={
                <>
                  <Price
                    price={payment.totalAmountCharged.toNumber() - payment.shippingAmount.toNumber()}
                    symbol={payment.totalAmountChargedCurrency.symbol ?? payment.totalAmountChargedCurrency.ticker}
                    network={payment.network}
                  />
                </>
              }
            />
            <DetailField
              label="Shipping"
              value={
                <>
                  <Price
                    price={payment.shippingAmount}
                    symbol={payment.totalAmountChargedCurrency.symbol ?? payment.totalAmountChargedCurrency.ticker}
                    network={payment.network}
                  />
                </>
              }
            />
          </>
        )}

        <DetailField
          label="Order Total"
          value={
            <>
              <Price
                price={payment.totalAmountCharged}
                symbol={payment.totalAmountChargedCurrency.symbol ?? payment.totalAmountChargedCurrency.ticker}
                network={payment.network}
              />
            </>
          }
        />

        <DetailLinkField
          label="Transaction Hash"
          value={payment.transactionHash || ""}
          href={explorerLink("cardanoscan", payment.network, payment.transactionHash)}
        />
      </dl>
    </DetailPanel>
  )
}
