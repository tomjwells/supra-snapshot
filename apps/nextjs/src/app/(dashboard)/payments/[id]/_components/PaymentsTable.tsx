import Link from "next/link"
import { PaymentStatus } from "@acme/db"
import EmptyRow from "@acme/ui/Table/EmptyRow"
import { ProductAvatarItem } from "@acme/ui/Table/TableAvatarItem"
import { Badge, Table } from "@radix-ui/themes"

import type { PaymentsType } from "~/_backend/payments"
import { Price } from "~/utils/ClientPrice"

export function PaymentsTable({ payments }: { payments: PaymentsType }) {
  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Time</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Product</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Amount</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {payments.length === 0 && <EmptyRow text="No payments yet" />}
        {payments.length > 0 && payments.map((payment) => <PaymentRow key={payment.id} payment={payment} />)}
      </Table.Body>
    </Table.Root>
  )
}

export function PaymentRow({ payment }: { payment: PaymentsType[number] }) {
  const url = `/payments/${payment.id}`
  return (
    <Table.Row key={payment.id}>
      <Table.RowHeaderCell
        style={{
          verticalAlign: "middle",
        }}
        className="text-slate-10"
      >
        <Link href={url}>{payment.createdAt.toLocaleDateString()}</Link>
      </Table.RowHeaderCell>
      <Table.Cell
        style={{
          verticalAlign: "middle",
        }}
        className="text-slate-10"
      >
        <Link href={url}>{payment.createdAt.toLocaleTimeString()}</Link>
      </Table.Cell>
      <Table.Cell>
        <Link href={`/payments/${payment.id}`}>
          <ProductAvatarItem product={payment.product} />
        </Link>
      </Table.Cell>
      <Table.Cell
        style={{
          verticalAlign: "middle",
        }}
      >
        <Link href={url} className="text-slate-10">
          <Price
            price={payment.totalAmountCharged}
            symbol={payment.totalAmountChargedCurrency.symbol ?? payment.totalAmountChargedCurrency.ticker}
            network={payment.network}
          />
        </Link>
      </Table.Cell>
      <Table.Cell
        style={{
          verticalAlign: "middle",
        }}
      >
        <Link href={url}>
          <Badge
            className="capitalize"
            color={(payment.status === PaymentStatus.COMPLETE && "green") || (payment.status === PaymentStatus.PENDING && "yellow") || "gray"}
          >
            {payment.status === PaymentStatus.COMPLETE ? "Paid" : payment.status.toLowerCase()}
          </Badge>
        </Link>
      </Table.Cell>
    </Table.Row>
  )
}
