import { Suspense } from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ProductStatus } from "@acme/db"
import PageHeader from "@acme/ui/PageHeader"
import { ProductAvatarItem } from "@acme/ui/Table"
import EmptyRow from "@acme/ui/Table/EmptyRow"
import { Flex, Heading, Table, Text } from "@radix-ui/themes"

import { getCollection } from "~/_backend/collections"
import type { CollectionType } from "~/_backend/collections"
import EllipsesMenu from "./_components/EllipsesMenu"

export const runtime = "nodejs"

export const metadata = {
  title: "Variants",
}

export default function Page({ params: { id } }: { params: { id: string } }) {
  return (
    <Flex direction="column" gap="6" className="h-full">
      <PageHeader
        title={
          <Heading as="h1" size="5" weight="medium" className="text-gray-8">
            Manage your variants and their attributes.
          </Heading>
        }
      />
      <Suspense>
        <VariantsTable id={id} />
      </Suspense>
    </Flex>
  )
}

export async function VariantsTable({ id }: { id: string }) {
  const collection = await getCollection(id)
  if (!collection) return redirect(`/collections`)
  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Variant</Table.ColumnHeaderCell>
          {collection.attributes
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map((attribute) => (
              <Table.ColumnHeaderCell key={attribute.id}>{attribute.name}</Table.ColumnHeaderCell>
            ))}
          <Table.ColumnHeaderCell width="30px" />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {collection.variants
          .filter((variant) => !!variant.product)
          .filter((variant) => variant.product?.status === ProductStatus.ACTIVE)
          .map((variant) => (
            <Row key={variant.id} collectionId={collection.id} attributes={collection.attributes} variant={variant} />
          ))}
        {collection.variants.length === 0 && <EmptyRow text="Click New Variant to add the first Variant." />}
      </Table.Body>
    </Table.Root>
  )
}

export function Row({
  attributes,
  variant,
}: {
  collectionId: string
  attributes: NonNullable<CollectionType>["attributes"]
  variant: NonNullable<CollectionType>["variants"][number]
}) {
  const product = variant.product
  const variantUrl = `variants/${variant?.id}`
  return (
    <Table.Row
      style={{
        verticalAlign: "middle",
      }}
    >
      <Table.Cell>
        <span className="flex items-start">
          <Link href={variantUrl}>
            <ProductAvatarItem product={product} />
          </Link>
        </span>
      </Table.Cell>
      {attributes
        ?.sort((a, b) => a.orderIndex - b.orderIndex)
        .map((attribute) => (
          <Table.Cell key={attribute.id}>
            <Text>
              {variant.attributeValues.find((attributeValues) => attributeValues.attributeId === attribute.id)?.value ?? (
                <Text className="text-slate-10">--</Text>
              )}
            </Text>
          </Table.Cell>
        ))}
      <Table.Cell>
        <EllipsesMenu variantId={variant.id} />
      </Table.Cell>
    </Table.Row>
  )
}
