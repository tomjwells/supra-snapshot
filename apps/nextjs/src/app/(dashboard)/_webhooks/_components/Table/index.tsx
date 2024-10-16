"use client"

import EmptyRow from "@acme/ui/Table/EmptyRow"
import { Table } from "@radix-ui/themes"

import NotificationSourceRow from "./NotificationSourceRow"

export default function NotificationsTable() {
  const [notificationSources, _query] = api.notificationSources.list.useSuspenseQuery()

  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Sources</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell />
          <Table.ColumnHeaderCell />
          <Table.ColumnHeaderCell />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {notificationSources.length === 0 && <EmptyRow text="No sources yet" />}
        {notificationSources.length > 0 &&
          notificationSources.map((notificationSource) => <NotificationSourceRow key={notificationSource.id} notificationSource={notificationSource} />)}
      </Table.Body>
    </Table.Root>
  )
}
