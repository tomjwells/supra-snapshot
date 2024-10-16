"use client"

import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { NotificationSourceStatus } from "@prisma/client"
import { Badge, Table } from "@radix-ui/themes"

import type { NotificationSourcesType } from "~/_backend/notificationSources"

export default function NotificationSourceRow({ notificationSource }: { notificationSource: NotificationSourcesType[number] }) {
  const router = useRouter()
  return (
    <Table.Row onClick={() => router.push(`/notification-sources/${notificationSource.id}`)}>
      <Table.RowHeaderCell
        style={{
          verticalAlign: "middle",
        }}
      >
        <Link href={`/notification-sources/${notificationSource.id}`}>
          <div className="flex gap-x-4">
            <img
              className="h-12 w-12 flex-none rounded-full bg-gray-2"
              src={
                "data:image/png;base64,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"
              }
              alt=""
            />
            <div className="flex items-center gap-x-3">
              <p className="text-sm font-semibold leading-6 text-slate-12">{notificationSource.name}</p>
            </div>
          </div>
        </Link>
      </Table.RowHeaderCell>
      <Table.Cell
        style={{
          verticalAlign: "middle",
        }}
      >
        <Link href={`/notification-sources/${notificationSource.id}`}>
          <div className="flex gap-x-4">
            <div className="flex items-center gap-x-3">
              <Badge color={notificationSource.status === NotificationSourceStatus.ACTIVE ? "green" : "gray"}>{notificationSource.status}</Badge>
            </div>
          </div>
        </Link>
      </Table.Cell>
      <Table.Cell
        style={{
          verticalAlign: "middle",
        }}
      >
        <Link href={`/notification-sources/${notificationSource.id}`}>
          <div className="leading-5 text-slate-10">{notificationSource.email_address}</div>
        </Link>
      </Table.Cell>
      <Table.Cell
        align="right"
        style={{
          verticalAlign: "middle",
        }}
      >
        <Link href={`/notification-sources/${notificationSource.id}`}>
          <p className="truncate leading-5 text-slate-10">{notificationSource._count.Notifications} notifications sent</p>
        </Link>
      </Table.Cell>
    </Table.Row>
  )
}
