import { Suspense } from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { cloudinaryImageSrc } from "@acme/cloudinary/cloudinary-client"
import Loading from "@acme/ui/loading"
import { Flex } from "@radix-ui/themes"

import { listByProductId } from "~/_backend/checkoutLinks"
import { listCurrencies, listCurrenciesIncludingFiat } from "~/_backend/currencies"
import { getEnvironment } from "~/_backend/environments"
import { getOrganization } from "~/_backend/organizations"
import { getProduct } from "~/_backend/products"
import { listShippingPolicies } from "~/_backend/shippingPolicies"
import CheckoutLinks from "~/app/(dashboard)/_checkout-links/CheckoutLinks"
import CollectCustomerInformation from "./_components/sections/CollectCustomerInformation"
import InformationPanel from "./_components/sections/InformationPanel"
import Inventory from "./_components/sections/Inventory"

export const runtime = "nodejs"

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = await getProduct(params.id)
  if (!product) return redirect(`/products`)
  return {
    title: product.name || "New Product",
    openGraph: {
      images: [cloudinaryImageSrc(product.image ?? "")],
    },
  }
}

export default async function Page({ params: { id } }: { params: { id: string } }) {
  return (
    <Flex direction="column" gap="6" className="h-full">
      <Suspense fallback={<Loading />}>
        <InformationPanel product={await getProduct(id)} currencies={await listCurrencies()} currenciesIncludingFiat={await listCurrenciesIncludingFiat()} />
      </Suspense>
      <Suspense fallback={<Loading />}>
        <CollectCustomerInformation product={await getProduct(id)} shippingPolicies={await listShippingPolicies()} />
      </Suspense>
      <Suspense>
        <Inventory product={await getProduct(id)} />
      </Suspense>
      <Suspense>
        <CheckoutLinks environment={await getEnvironment()} organization={await getOrganization()} checkoutLinks={await listByProductId(id)} productId={id} />
      </Suspense>
    </Flex>
  )
}
