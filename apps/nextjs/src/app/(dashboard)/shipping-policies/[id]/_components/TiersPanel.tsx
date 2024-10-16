import React from "react"
import DetailPanel from "@acme/ui/List/[id]/DetailPanel"
import { Button } from "@radix-ui/themes"

import { createShippingPolicyZoneAction } from "~/_actions/shippingPolicies"
import { listCountries } from "~/_backend/countries"
import { listCurrenciesIncludingFiat } from "~/_backend/currencies"
import type { ShippingPolicyType } from "~/_backend/shippingPolicies"
import Tier from "./Tier"

export default async function TiersPanel({ shippingPolicy }: { shippingPolicy: ShippingPolicyType }) {
  if (!shippingPolicy) return null
  const [currenciesIncludingFiat, countries] = await Promise.all([listCurrenciesIncludingFiat(), listCountries()])
  const createShippingPolicyZoneActionForm = createShippingPolicyZoneAction.bind(null, { shippingPolicyId: shippingPolicy.id })

  return (
    <DetailPanel
      title="Shipping Zones"
      subtitle="Define the shipping prices and which countries they apply to."
      fullWidth
      RightHeadingActions={
        <form action={createShippingPolicyZoneActionForm}>
          <span className="rounded-md bg-transparent shadow-sm">
            <Button variant="surface" size="2" color="gray" type="submit" className="whitespace-nowrap">
              Add Shipping Zone
            </Button>
          </span>
        </form>
      }
    >
      <dl className="divide-y divide-gray-4">
        {shippingPolicy.ShippingPolicyZone.map((zone, index) => (
          <Tier
            key={zone.id}
            index={index}
            tier={zone}
            shippingPolicy={shippingPolicy}
            currenciesIncludingFiat={currenciesIncludingFiat}
            countries={countries}
            environment={shippingPolicy.Environment}
          />
        ))}
        {shippingPolicy.ShippingPolicyZone.length === 0 && <p className="py-4 text-center text-gray-7">No shipping zones defined yet.</p>}
      </dl>
    </DetailPanel>
  )
}
