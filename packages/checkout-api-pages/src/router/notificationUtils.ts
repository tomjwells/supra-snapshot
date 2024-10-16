import type { Payment, Product } from "@acme/db"
import { NotificationSourceStatus, NotificationSourceType, prisma } from "@acme/db"
import { sendPaymentReceivedEmailToSeller } from "@acme/email/functions"

// @ts-expect-error cjs
import { env } from "../../env.ts"

export async function sendNotifications(payment: Payment, product: Product): Promise<boolean> {
  const notificationSources = await getActiveNotificationSources(product.environmentId)

  for (const notificationSource of notificationSources) {
    if (
      product.environmentId &&
      product.environmentId === notificationSource.environmentId &&
      notificationSource.status === NotificationSourceStatus.ACTIVE &&
      notificationSource.email_address
    ) {
      switch (notificationSource.type) {
        case NotificationSourceType.EMAIL:
          await sendEmailNotification(notificationSource, payment, product)
          break
        default:
          console.log("Unknown notification source type")
      }
    }
  }
  return true
}

export async function sendEmailNotification(
  notificationSource: Awaited<ReturnType<typeof getActiveNotificationSources>>[number],
  payment: Payment,
  product: Product,
) {
  console.log("Sending email")
  if (!notificationSource.email_address) {
    console.log("Email address not set")
    return false
  }

  const notification = await prisma.notification.create({
    data: {
      type: NotificationSourceType.EMAIL,
      email_address: notificationSource.email_address,
      email_subject: `Payment received for ${product.name!}`,
      payment: {
        connect: {
          id: payment.id,
        },
      },
      status: "in progress",
      notificationSource: {
        connect: {
          id: notificationSource.id,
        },
      },
    },
    include: {
      notificationSource: {
        include: {
          environment: {
            include: {
              Organization: true,
            },
          },
        },
      },
    },
  })

  if (notification.notificationSource.email_address) {
    await sendPaymentReceivedEmailToSeller(
      env.NEXT_PUBLIC_NODE_ENV,
      notification.notificationSource.email_address,
      notification.notificationSource.environment.Organization.name,
      notification.email_subject,
      payment,
      product,
    )
    await prisma.notification.update({
      where: {
        id: notification.id,
      },
      data: {
        status: "complete",
      },
    })
  }

  return true
}

export async function getActiveNotificationSources(environmentId: string) {
  if (!environmentId) throw new Error("environmentId is undefined")
  else
    return prisma.notificationSource.findMany({
      where: {
        environmentId,
        status: NotificationSourceStatus.ACTIVE,
      },
      include: {
        environment: {
          include: {
            Organization: true,
          },
        },
      },
    })
}
