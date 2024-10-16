import PageHeader from "@acme/ui/PageHeader"
import { Flex } from "@radix-ui/themes"

import { getProduct } from "~/_backend/products"
import { EllipsesMenu } from "../../_components/Table/EllipsesMenu"

export default async function Header({ id }: { id: string }) {
  const product = await getProduct(id)

  return (
    <PageHeader
      title={(product ? product.name : id) ?? undefined}
      RightComponent={
        <Flex direction="row" gap="6" align="center">
          <EllipsesMenu productId={id} redirectOnDuplicate={true} />
        </Flex>
      }
    />
  )
}
