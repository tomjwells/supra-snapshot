import { Suspense } from "react"
import NewResourceActionButton from "@acme/ui/Buttons/NewResourceActionButton"
import PageHeader from "@acme/ui/PageHeader"
import { Flex } from "@radix-ui/themes"

import { createProductAction } from "~/_actions/products"
import { listProducts } from "~/_backend/products"
import { ProductsTable } from "./_components/Table"

export const runtime = "nodejs"

export const metadata = {
  title: "Products",
}

export default async function Page() {
  return (
    <Flex direction="column" gap="6" className="h-full">
      <PageHeader
        title="Products"
        RightComponent={
          <form action={createProductAction}>
            <NewResourceActionButton resource="Product" />
          </form>
        }
      />
      <Suspense>
        <ProductsTable products={await listProducts()} />
      </Suspense>
    </Flex>
  )
}
