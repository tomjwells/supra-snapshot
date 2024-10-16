import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool } from '@neondatabase/serverless'


import * as Enums from "@prisma/client"
export const { PaymentStatus, ProductStatus, CheckoutLinkStatus, CollectionStatus, CurrencyType, CustomInformationFieldType, Network,  NotificationSourceStatus, NotificationSourceType, OrganizationTier, Region, WebhookEventType, WebhookStatus, Prisma } = Enums

const globalForPrisma = globalThis as { prisma?: PrismaClient }
const neon = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaNeon(neon)

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === 'development'
        ? ['error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
