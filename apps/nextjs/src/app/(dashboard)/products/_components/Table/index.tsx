import React from "react"
import Link from "next/link"
import EmptyRow from "@acme/ui/Table/EmptyRow"
import { ProductAvatarItem } from "@acme/ui/Table/TableAvatarItem"
import { Table } from "@radix-ui/themes"

import { listProducts } from "~/_backend/products"
import { ProductPrice } from "~/utils/ClientPrice"
import { EllipsesMenu } from "./EllipsesMenu"

export function ProductsTable({ products }: { products: Awaited<ReturnType<typeof listProducts>> }) {
  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Product</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Price</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Quantity Available</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell width="30px"></Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {products.length === 0 && <EmptyRow text="Click the New Product button to add new products." />}
        {products.length > 0 && products.map((product) => !product.Variant && <ProductRow key={product.id} product={product} />)}
      </Table.Body>
    </Table.Root>
  )
}

export function ProductRow({ product }: { product: Awaited<ReturnType<typeof listProducts>>[number] }) {
  const url = `/products/${product.id}`

  return (
    <Table.Row className="px-4 py-5">
      <Table.RowHeaderCell
        style={{
          verticalAlign: "middle",
        }}
      >
        <Link href={url}>
          <ProductAvatarItem product={product} />
        </Link>
      </Table.RowHeaderCell>
      <Table.Cell
        style={{
          verticalAlign: "middle",
        }}
      >
        <Link href={url} className=" !border-t !border-gray-4">
          <p className="mt-1 flex leading-5 text-slate-10">
            <ProductPrice product={product} />
          </p>
        </Link>
      </Table.Cell>
      <Table.Cell
        style={{
          verticalAlign: "middle",
        }}
      >
        <Link href={url} className=" !border-t !border-gray-4">
          <p className="mt-1 flex leading-5 text-slate-10">{!product.inventory_track ? "--" : `${product.inventory_quantity} left in stock`}</p>
        </Link>
      </Table.Cell>

      <Table.Cell
        style={{
          verticalAlign: "middle",
        }}
      >
        <EllipsesMenu productId={product.id} />
      </Table.Cell>
    </Table.Row>
  )
}
