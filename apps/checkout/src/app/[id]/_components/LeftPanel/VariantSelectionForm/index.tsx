/* eslint-disable @typescript-eslint/require-await */

import type { CheckoutLinkType } from "~/_backend/checkoutLinks"
import type { ProductType } from "~/_backend/products"
import { AttributeSelectMenu } from "./AttributeSelectMenu"

export default function VariantSelectionForm({ checkoutLink, product }: { checkoutLink: CheckoutLinkType; product: NonNullable<ProductType> }) {
  if (!checkoutLink.collection) return null

  const selectableVariants = checkoutLink.collection.variants

  return (
    <form id="attribute-form" className="flex flex-1 flex-col gap-5">
      {checkoutLink.collection?.attributes
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .filter((attribute) => attribute.values.length > 0)
        .map((attribute) => (
          <AttributeSelectMenu key={attribute.id} checkoutLink={checkoutLink} attribute={attribute} product={product} selectableVariants={selectableVariants} />
        ))}
    </form>
  )
}
