import Link from "next/link"
import EmptyRow from "@acme/ui/Table/EmptyRow"
import { Table } from "@radix-ui/themes"

import { listShippingPolicies } from "~/_backend/shippingPolicies"
import type { ShippingPolicyType } from "~/_backend/shippingPolicies"
import { EllipsesMenu } from "./EllipsesMenu"

export async function ShippingPoliciesTable() {
  const shippingPolicies = await listShippingPolicies()

  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Zones</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Assigned Products</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell width="30px" />
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {shippingPolicies.length === 0 && <EmptyRow text="No Shipping Policies yet" />}
        {shippingPolicies.length > 0 && shippingPolicies.map((shippingPolicy) => <ShippingPolicyRow key={shippingPolicy.id} shippingPolicy={shippingPolicy} />)}
      </Table.Body>
    </Table.Root>
  )
}

export function ShippingPolicyRow({ shippingPolicy }: { shippingPolicy: NonNullable<ShippingPolicyType> }) {
  const url = `/shipping-policies/${shippingPolicy.id}`
  return (
    <Table.Row key={shippingPolicy.id}>
      <Table.RowHeaderCell
        style={{
          verticalAlign: "middle",
        }}
        className="text-slate-10"
      >
        <Link href={url}>{shippingPolicy.name}</Link>
      </Table.RowHeaderCell>
      <Table.Cell
        style={{
          verticalAlign: "middle",
        }}
        className="text-slate-10"
      >
        <Link href={url}>{shippingPolicy.ShippingPolicyZone.length}</Link>
      </Table.Cell>
      <Table.Cell
        style={{
          verticalAlign: "middle",
        }}
        className="text-slate-10"
      >
        <Link href={url}>{shippingPolicy.Product.length}</Link>
      </Table.Cell>
      <Table.Cell>
        <EllipsesMenu shippingPolicyId={shippingPolicy.id} />
      </Table.Cell>
    </Table.Row>
  )
}
