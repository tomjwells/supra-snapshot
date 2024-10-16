import { cache } from "react"
import { prisma } from "@acme/db"
import { NotificationSourceType as NotificationSourceEnum, NotificationSourceStatus } from "@prisma/client"
import { z } from "zod"

export type NotificationSourcesType = Awaited<ReturnType<typeof listNotificationSources>>
export const listNotificationSources = cache(async (environmentId: string) =>
  prisma.notificationSource.findMany({
    where: {
      environment: { is: { id: environmentId } },
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      _count: {
        select: { Notifications: true },
      },
    },
  }),
)

export type NotificationSourceType = Awaited<ReturnType<typeof getNotificationSource>>
export const getNotificationSource = cache(async (id: string, environmentId: string) =>
  prisma.notificationSource.findFirst({
    where: {
      id,
      environment: { is: { id: environmentId } },
    },
  }),
)

export const updateNotificationSourceSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.nativeEnum(NotificationSourceEnum),
  email_address: z.string().email(),
  status: z.nativeEnum(NotificationSourceStatus),
})
export const updateNotificationSource = async (input: z.infer<typeof updateNotificationSourceSchema>) =>
  prisma.notificationSource.update({
    where: {
      id: input.id,
    },
    data: {
      name: input.name,
      type: input?.type,
      email_address: input.email_address,
      status: input.status,
    },
  })

export const deleteNotificationSource = async (id: string) =>
  prisma.notificationSource.delete({
    where: {
      id,
    },
  })

export const getNotifications = cache(async (id: string) =>
  prisma.notification.findMany({
    where: {
      notificationSource: { is: { id } },
    },
    include: {
      notificationSource: true,
      payment: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  }),
)
