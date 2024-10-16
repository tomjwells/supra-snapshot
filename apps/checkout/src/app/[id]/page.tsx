import { Suspense } from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { cloudinaryImageSrc } from "@acme/cloudinary/cloudinary-client"
import { CheckoutLinkStatus } from "@prisma/client"
import { Box, Flex } from "@radix-ui/themes"

import { getCheckoutLink } from "~/_backend/checkoutLinks"
import { getProductFrom } from "~/_backend/products"
import LeftPanel from "./_components/LeftPanel"
import RightPanel from "./_components/RightPanel"
import CheckoutFormProvider from "./_providers/CheckoutFormProvider"
import AppDirMeshProvider from "./_providers/MeshProvider"

export const runtime = "nodejs" // Edge size limit

export async function generateMetadata({
  params: { id },
  searchParams: { variant },
}: {
  params: { id: string }
  searchParams: { variant: string }
}): Promise<Metadata> {
  const checkoutLink = await getCheckoutLink(id)
  const product = await getProductFrom(checkoutLink, variant)

  if (!checkoutLink) redirect("/")
  if (checkoutLink.status !== CheckoutLinkStatus.ACTIVE) redirect("/") // Important safeguard that prevents info about archived (or otherwise inactive link) being shown to user

  if (!product) redirect("/") // This should only happen if it's a collection with no variants
  if (!product) throw new Error("No product")

  // metadata vars
  const title = `${product.name} - ${product.Environment.Organization.name}`
  const icon = product.image ? cloudinaryImageSrc(product.image) : "https://suprapayments.io/favicon.png"
  const description = product.description ?? ""
  const creator = product.Environment.Organization.name

  return {
    title,
    icons: [icon],
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator,
    },
    openGraph: {
      title,
      description,
    },
  }
}

export default async function Page({
  params: { id },
  searchParams: { variant, token },
}: {
  params: { id: string }
  searchParams: { variant: string; token: string }
}) {
  const checkoutLink = await getCheckoutLink(id)
  const product = await getProductFrom(checkoutLink, variant)
  const selectedCurrency = product?.acceptedCurrencies.find((c) => c.ticker === token) || product?.acceptedCurrencies[0]

  if (!product || !selectedCurrency) return null
  return (
    <CheckoutFormProvider product={product}>
      <div
        className="min-h-screen w-screen bg-white font-sans subpixel-antialiased dark:bg-slate-1"
        style={{
          position: "fixed",
          overflowY: "scroll",
          height: "100vh",
        }}
      >
        <Flex
          className="min-h-screen overflow-y-scroll"
          direction={{
            initial: "column",
            sm: "row",
          }}
        >
          <Box
            className="dark  md:h-screen md:min-w-[50vw]"
            style={{
              backgroundColor: "hsl(236 20% 10%)",
            }}
          >
            <LeftPanel checkoutLink={checkoutLink} product={product} selectedCurrency={selectedCurrency} />
          </Box>
          <Box style={{ backgroundColor: "var(--white)" }} className="min-h-[50vh] md:min-w-[50vw]">
            <Suspense>
              <AppDirMeshProvider>
                <RightPanel product={product} checkoutLink={checkoutLink} selectedCurrency={selectedCurrency} />
              </AppDirMeshProvider>
            </Suspense>
          </Box>
        </Flex>
      </div>
    </CheckoutFormProvider>
  )
}
