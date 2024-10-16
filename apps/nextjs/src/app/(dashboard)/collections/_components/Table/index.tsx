import React from "react"
import Link from "next/link"
import EmptyRow from "@acme/ui/Table/EmptyRow"
import { Table } from "@radix-ui/themes"

import type { CollectionsType } from "~/_backend/collections"
import { listCollections } from "~/_backend/collections"
import { auth } from "~/utils/auth"
import { EllipsesMenu } from "./EllipsesMenu"

export default async function ProductsTable() {
  const collections = await listCollections((await auth()).user.selectedEnvironmentId)

  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Attributes</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Number of Variants</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell width="30px" />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {collections.length === 0 && <EmptyRow text="Click the New Collection button to add a new collection." />}
        {collections.length > 0 && collections.map((collection) => <Row key={collection.id} collection={collection} />)}
      </Table.Body>
    </Table.Root>
  )
}

export function Row({ collection }: { collection: CollectionsType[number] }) {
  const url = `/collections/${collection.id}`

  return (
    <Table.Row
      className="px-4 py-5"
      style={{
        verticalAlign: "middle",
      }}
    >
      <Table.RowHeaderCell>
        <Link href={url}>{collection.name}</Link>
      </Table.RowHeaderCell>
      <Table.Cell>
        <Link href={url} className=" !border-t !border-gray-4">
          <p className="mt-1 flex leading-5 text-slate-10">{collection.attributes?.map((attribute) => attribute.name).join(", ")}</p>
        </Link>
      </Table.Cell>
      <Table.Cell>
        <Link href={url} className=" !border-t !border-gray-4">
          <p className="mt-1 flex leading-5 text-slate-10">{collection.variants.length}</p>
        </Link>
      </Table.Cell>
      <Table.Cell>
        <EllipsesMenu collectionId={collection.id} />
      </Table.Cell>
    </Table.Row>
  )
}
