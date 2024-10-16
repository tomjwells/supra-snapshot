import { redirect } from "next/navigation"
import PageHeader from "@acme/ui/PageHeader"
import TooltipPopover from "@acme/ui/TooltipPopover"
import { Flex } from "@radix-ui/themes"

import type { CollectionType } from "~/_backend/collections"

export default function Header({ collection }: { collection: CollectionType }) {
  if (!collection) return redirect(`/collections`)

  return (
    <Flex gap="4">
      <PageHeader title={(collection.name || collection.id) ?? undefined} titleFallback="Unnamed Collection" />
      <Flex direction="row" gap="6" align="center">
        <TooltipPopover
          size={20}
          text={
            <>
              The steps below describe how to set up a new collection:
              <br />
              <br />
              <ol>
                <li>1. First, add a name to the collection.</li>
                <br />
                <li>2. Next, use the Attributes panel to add the attributes and the options you would like to set.</li>
                <br />
                <li>3. When you click "Save" in the Attributes panel, the website will create the variants for you based on the attributes you defined.</li>
                <br />
                <li>
                  4. Visit the Variants tab to see the variants that were created. From the Variants tab, you can click in to each variant to begin editing the
                  information for that variant.
                </li>
                <br />
              </ol>
            </>
          }
        />
      </Flex>
    </Flex>
  )
}
