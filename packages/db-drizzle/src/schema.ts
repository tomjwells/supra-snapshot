import { sql } from "drizzle-orm";
import { boolean, foreignKey, index, integer, numeric, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { relations } from "drizzle-orm/relations";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";





export const CheckoutLinkStatus = pgEnum("CheckoutLinkStatus", ["ACTIVE", "INACTIVE", "ARCHIVED"])
export const CollectionStatus = pgEnum("CollectionStatus", ["ACTIVE", "ARCHIVED"])
export const CurrencyType = pgEnum("CurrencyType", ["FIAT", "CRYPTO"])
export const CustomInformationFieldType = pgEnum("CustomInformationFieldType", ["INPUT", "TEXTAREA"])
export const Network = pgEnum("Network", ["mainnet", "testnet"])
export const NotificationSourceStatus = pgEnum("NotificationSourceStatus", ["ACTIVE", "INACTIVE"])
export const NotificationSourceType = pgEnum("NotificationSourceType", ["EMAIL"])
export const OrganizationTier = pgEnum("OrganizationTier", ["FREE", "PROFESSIONAL"])
export const PaymentStatus = pgEnum("PaymentStatus", ["PENDING", "COMPLETE"])
export const ProductAttributeSelectionTypes = pgEnum("ProductAttributeSelectionTypes", ["DROPDOWN", "RADIO", "CHECKBOX"])
export const ProductStatus = pgEnum("ProductStatus", ["ACTIVE", "INACTIVE", "ARCHIVED"])
export const Region = pgEnum("Region", ["NORTH_AMERICA", "EUROPE", "SOUTH_AMERICA", "AFRICA", "ASIA", "OCEANIA"])
export const WebhookEventType = pgEnum("WebhookEventType", [
  "payment_created",
  "payment_completed",
  "payment_failed",
  "payment_refunded",
  "payment_cancelled",
  "payment_expired",
])
export const WebhookStatus = pgEnum("WebhookStatus", ["ACTIVE", "INACTIVE"])

export const CollectionAttributeValue = pgTable("CollectionAttributeValue", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  createdAt: timestamp("createdAt", { precision: 3, mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", {
    mode: "date",
    withTimezone: true,
  })
    .notNull()
    .$onUpdateFn(() => sql`now()`),
  orderIndex: integer("orderIndex").default(0).notNull(),
  value: text("value"),
  attributeId: text("attributeId").notNull(),
})

export const User = pgTable(
  "User",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    name: text("name"),
    email: text("email"),
    emailVerified: timestamp("emailVerified", { precision: 3, mode: "string" }),
    image: text("image"),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" }).defaultNow(),
    selectedOrganizationId: text("selectedOrganizationId"),
    personalOrganizationId: text("personalOrganizationId"),
  },
  (table) => {
    return {
      email_key: uniqueIndex("User_email_key").using("btree", table.email),
      personalOrganizationId_idx: index("User_personalOrganizationId_idx").using("btree", table.personalOrganizationId),
      selectedOrganizationId_idx: index("User_selectedOrganizationId_idx").using("btree", table.selectedOrganizationId),
    }
  },
)

export const VerificationToken = pgTable(
  "VerificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { precision: 3, mode: "date" }).notNull(),
  },
  (table) => {
    return {
      identifier_token_key: uniqueIndex("VerificationToken_identifier_token_key").using("btree", table.identifier, table.token),
      token_key: uniqueIndex("VerificationToken_token_key").using("btree", table.token),
    }
  },
)

export const Session = pgTable(
  "Session",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    sessionToken: text("sessionToken").notNull(),
    userId: text("userId")
      .notNull()
      .references(() => User.id, { onDelete: "cascade", onUpdate: "cascade" }),
    expires: timestamp("expires", { precision: 3 }).notNull(),
  },
  (table) => {
    return {
      sessionToken_key: uniqueIndex("Session_sessionToken_key").using("btree", table.sessionToken),
      userId_idx: index("Session_userId_idx").using("btree", table.userId),
    }
  },
)

export const Environment = pgTable(
  "Environment",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", {
      mode: "date",
      withTimezone: true,
    }).$onUpdateFn(() => sql`now()`),
    name: text("name").notNull(),
    type: text("type").notNull(),
    network: Network("network").default("testnet").notNull(),
    organizationId: text("organizationId")
      .notNull()
      .references(() => Organization.id, { onDelete: "restrict", onUpdate: "cascade" }),
  },
  (table) => {
    return {
      organizationId_idx: index("Environment_organizationId_idx").using("btree", table.organizationId),
    }
  },
)


export const Collection = pgTable(
  "Collection",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", {
      mode: "date",
      withTimezone: true,
    })
      .notNull()
      .$onUpdateFn(() => sql`now()`),
    name: text("name").notNull(),
    status: CollectionStatus("status").default("ACTIVE").notNull(),
    environmentId: text("environmentId")
      .notNull()
      .references(() => Environment.id, { onDelete: "restrict", onUpdate: "cascade" }),
  },
  (table) => {
    return {
      environmentId_idx: index("Collection_environmentId_idx").using("btree", table.environmentId),
    }
  },
)

export const CollectionAttribute = pgTable("CollectionAttribute", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  createdAt: timestamp("createdAt", { precision: 3, mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", {
    mode: "date",
    withTimezone: true,
  })
    .notNull()
    .$onUpdateFn(() => sql`now()`),
  orderIndex: integer("orderIndex").notNull(),
  name: text("name"),
  collectionId: text("collectionId").notNull(),
})

export const Variant = pgTable(
  "Variant",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", {
      mode: "date",
      withTimezone: true,
    })
      .notNull()
      .$onUpdateFn(() => sql`now()`),
    collectionId: text("collectionId").notNull(),
  },
  (table) => {
    return {
      collectionId_idx: index("Variant_collectionId_idx").using("btree", table.collectionId),
    }
  },
)

export const Product = pgTable(
  "Product",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    name: text("name"),
    description: text("description"),
    image: text("image"),
    price: numeric("price", { precision: 10, scale: 2 }),
    currencyId: text("currencyId")
      .notNull()
      .references(() => Currencies.id, { onDelete: "restrict", onUpdate: "cascade" }),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", {
      mode: "date",
      withTimezone: true,
    })
      .notNull()
      .$onUpdateFn(() => sql`now()`),
    environmentId: text("environmentId")
      .notNull()
      .references(() => Environment.id, { onDelete: "restrict", onUpdate: "cascade" }),
    withdrawalMethod: text("withdrawalMethod").default("instant").notNull(),
    collect_email: boolean("collect_email").default(false).notNull(),
    collect_address: boolean("collect_address").default(false).notNull(),
    inventory_track: boolean("inventory_track").default(false).notNull(),
    inventory_continueSelling: boolean("inventory_continueSelling").default(false).notNull(),
    inventory_quantity: integer("inventory_quantity").default(0).notNull(),
    quantity_variable: boolean("quantity_variable").default(false).notNull(),
    quantity_minimum: integer("quantity_minimum").default(1).notNull(),
    quantity_maximum: integer("quantity_maximum").default(10).notNull(),
    shippingPolicyId: text("shippingPolicyId").references(() => ShippingPolicy.id, { onDelete: "set null", onUpdate: "cascade" }),
    status: ProductStatus("status").default("ACTIVE").notNull(),
    variantId: text("variantId"),
  },
  (table) => {
    return {
      currencyId_idx: index("Product_currencyId_idx").using("btree", table.currencyId),
      environmentId_idx: index("Product_environmentId_idx").using("btree", table.environmentId),
      variantId_key: uniqueIndex("Product_variantId_key").using("btree", table.variantId),
    }
  },
)

export const CustomerPaymentPhysicalAddress = pgTable("CustomerPaymentPhysicalAddress", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  createdAt: timestamp("createdAt", { precision: 3, mode: "string" }).defaultNow().notNull(),
  firstName: text("firstName").notNull(),
  lastName: text("lastName").notNull(),
  line1: text("line1").notNull(),
  line2: text("line2").notNull(),
  city: text("city").notNull(),
  StateProvinceCounty: text("StateProvinceCounty").notNull(),
  ZipOrPostcode: text("ZipOrPostcode").notNull(),
  country: text("country").notNull(),
})

export const CustomInformation = pgTable(
  "CustomInformation",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    orderIndex: integer("orderIndex").default(0).notNull(),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", {
      mode: "date",
      withTimezone: true,
    })
      .notNull()
      .$onUpdateFn(() => sql`now()`),
    request: text("request").notNull(),
    field_type: CustomInformationFieldType("field_type").notNull(),
    productId: text("productId").references(() => Product.id, { onDelete: "set null", onUpdate: "cascade" }),
  },
  (table) => {
    return {
      productId_idx: index("CustomInformation_productId_idx").using("btree", table.productId),
    }
  },
)

export const CheckoutLink = pgTable(
  "CheckoutLink",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", {
      mode: "date",
      withTimezone: true,
    })
      .notNull()
      .$onUpdateFn(() => sql`now()`),
    redirect: boolean("redirect").default(false).notNull(),
    redirectUrl: text("redirectUrl").default("").notNull(),
    status: CheckoutLinkStatus("status").default("ACTIVE").notNull(),
    productId: text("productId"),
    collectionId: text("collectionId").references(() => Collection.id, { onDelete: "cascade", onUpdate: "cascade" }),
  },
  (table) => {
    return {
      productId_collectionId_idx: index("CheckoutLink_productId_collectionId_idx").using("btree", table.productId, table.collectionId),
    }
  },
)

export const SelectedEnvironment = pgTable(
  "SelectedEnvironment",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", {
      mode: "date",
      withTimezone: true,
    })
      .notNull()
      .$onUpdateFn(() => sql`now()`),
    userId: text("userId")
      .notNull()
      .references(() => User.id, { onDelete: "cascade", onUpdate: "cascade" }),
    environmentId: text("environmentId")
      .notNull()
      .references(() => Environment.id, { onDelete: "cascade", onUpdate: "cascade" }),
    organizationId: text("organizationId")
      .notNull()
      .references(() => Organization.id, { onDelete: "cascade", onUpdate: "cascade" }),
  },
  (table) => {
    return {
      environmentId_idx: index("SelectedEnvironment_environmentId_idx").using("btree", table.environmentId),
      organizationId_idx: index("SelectedEnvironment_organizationId_idx").using("btree", table.organizationId),
      userId_idx: index("SelectedEnvironment_userId_idx").using("btree", table.userId),
    }
  },
)

export const ShippingPolicy = pgTable(
  "ShippingPolicy",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", {
      mode: "date",
      withTimezone: true,
    })
      .notNull()
      .$onUpdateFn(() => sql`now()`),
    name: text("name").notNull(),
    environmentId: text("environmentId")
      .notNull()
      .references(() => Environment.id, { onDelete: "restrict", onUpdate: "cascade" }),
  },
  (table) => {
    return {
      environmentId_idx: index("ShippingPolicy_environmentId_idx").using("btree", table.environmentId),
    }
  },
)

export const Country = pgTable("Country", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  name: text("name").notNull(),
  code: text("code").notNull(),
  region: Region("region").notNull(),
  shippingPolicyZoneId: text("shippingPolicyZoneId"),
})

export const Customer = pgTable(
  "Customer",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", {
      mode: "date",
      withTimezone: true,
    })
      .notNull()
      .$onUpdateFn(() => sql`now()`),
    email: text("email").notNull(),
  },
  (table) => {
    return {
      email_key: uniqueIndex("Customer_email_key").using("btree", table.email),
    }
  },
)

export const ShippingPolicyZone = pgTable(
  "ShippingPolicyZone",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", {
      mode: "date",
      withTimezone: true,
    })
      .notNull()
      .$onUpdateFn(() => sql`now()`),
    shippingPolicyId: text("shippingPolicyId").notNull(),
    price: numeric("price", { precision: 16, scale: 8 }).default("0").notNull(),
    each_additional: numeric("each_additional", { precision: 16, scale: 8 }).default("0").notNull(),
    currencyId: text("currencyId").notNull(),
  },
  (table) => {
    return {
      shippingPolicyId_idx: index("ShippingPolicyZone_shippingPolicyId_idx").using("btree", table.shippingPolicyId),
    }
  },
)

export const NotificationSource = pgTable(
  "NotificationSource",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", {
      mode: "date",
      withTimezone: true,
    })
      .notNull()
      .$onUpdateFn(() => sql`now()`),
    environmentId: text("environmentId")
      .notNull()
      .references(() => Environment.id, { onDelete: "cascade", onUpdate: "cascade" }),
    name: text("name"),
    type: NotificationSourceType("type").default("EMAIL").notNull(),
    status: NotificationSourceStatus("status").default("ACTIVE").notNull(),
    email_address: text("email_address"),
  },
  (table) => {
    return {
      environmentId_idx: index("NotificationSource_environmentId_idx").using("btree", table.environmentId),
    }
  },
)

export const Organization = pgTable(
  "Organization",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    name: text("name").notNull(),
    image: text("image"),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", {
      mode: "date",
      withTimezone: true,
    })
      .notNull()
      .$onUpdateFn(() => sql`now()`),
    userId: text("userId")
      .notNull()
      .references(() => User.id, { onDelete: "cascade", onUpdate: "cascade" }),
    testnetWithdrawalAddress: text("testnetWithdrawalAddress"),
    mainnetWithdrawalAddress: text("mainnetWithdrawalAddress"),
    tier: OrganizationTier("tier").default("FREE").notNull(),
  },
  (table) => {
    return {
      userId_idx: index("Organization_userId_idx").using("btree", table.userId),
    }
  },
)

export const Webhook = pgTable(
  "Webhook",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", {
      mode: "date",
      withTimezone: true,
    })
      .notNull()
      .$onUpdateFn(() => sql`now()`),
    environmentId: text("environmentId")
      .notNull()
      .references(() => Environment.id, { onDelete: "restrict", onUpdate: "cascade" }),
    url: text("url"),
    status: WebhookStatus("status").default("ACTIVE").notNull(),
  },
  (table) => {
    return {
      environmentId_idx: index("Webhook_environmentId_idx").using("btree", table.environmentId),
    }
  },
)

export const Notification = pgTable(
  "Notification",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", {
      mode: "date",
      withTimezone: true,
    })
      .notNull()
      .$onUpdateFn(() => sql`now()`),
    notificationSourceId: text("notificationSourceId")
      .notNull()
      .references(() => NotificationSource.id, { onDelete: "cascade", onUpdate: "cascade" }),
    type: text("type").notNull(),
    email_address: text("email_address").notNull(),
    email_subject: text("email_subject").notNull(),
    paymentId: text("paymentId")
      .notNull()
      .references(() => Payment.id, { onDelete: "restrict", onUpdate: "cascade" }),
    status: text("status").notNull(),
  },
  (table) => {
    return {
      notificationSourceId_idx: index("Notification_notificationSourceId_idx").using("btree", table.notificationSourceId),
      paymentId_idx: index("Notification_paymentId_idx").using("btree", table.paymentId),
    }
  },
)

export const _CollectionAttributeValueToVariant = pgTable(
  "_CollectionAttributeValueToVariant",
  {
    A: text("A").notNull(),
    B: text("B").notNull(),
  },
  (table) => {
    return {
      AB_unique: uniqueIndex("_CollectionAttributeValueToVariant_AB_unique").using("btree", table.A, table.B),
      B_idx: index().using("btree", table.B),
    }
  },
)

export const Currencies = pgTable(
  "Currencies",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    orderIndex: integer("orderIndex").default(0).notNull(),
    label: text("label").notNull(),
    ticker: text("ticker").notNull(),
    type: CurrencyType("type").default("CRYPTO").notNull(),
    symbol: text("symbol").notNull(),
    decimals: integer("decimals").notNull(),
    enabled: boolean("enabled").default(true).notNull(),
    lastPrice: numeric("lastPrice", { precision: 20, scale: 12 }).notNull(),
    lastPriceUSD: numeric("lastPriceUSD", { precision: 20, scale: 12 }).notNull(),
    lastPriceTimestamp: timestamp("lastPriceTimestamp", { precision: 3, mode: "string" }).defaultNow().notNull(),
    preprodUnit: text("preprodUnit"),
    mainnetUnit: text("mainnetUnit"),
  },
  (table) => {
    return {
      label_key: uniqueIndex("Currencies_label_key").using("btree", table.label),
      ticker_key: uniqueIndex("Currencies_ticker_key").using("btree", table.ticker),
    }
  },
)

export const Payment = pgTable(
  "Payment",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", {
      mode: "date",
      withTimezone: true,
    })
      .notNull()
      .$onUpdateFn(() => sql`now()`),
    status: PaymentStatus("status").default("PENDING").notNull(),
    transactionHash: text("transactionHash"),
    network: Network("network").default("testnet").notNull(),
    unsignedTx: text("unsignedTx"),
    freeTier: boolean("freeTier").notNull(),
    totalAmountCharged: numeric("totalAmountCharged", { precision: 10, scale: 6 }).default("0").notNull(),
    totalAmountChargedCurrencyId: text("totalAmountChargedCurrencyId")
      .default("0db3331a-2868-46e2-9211-6549425bf247")
      .notNull()
      .references(() => Currencies.id, { onDelete: "restrict", onUpdate: "cascade" }),
    shippingAmount: numeric("shippingAmount", { precision: 10, scale: 6 }).default("0").notNull(),
    paymentPrice: numeric("paymentPrice", { precision: 10, scale: 6 }).default("0").notNull(),
    amount_withdrawn: numeric("amount_withdrawn", { precision: 10, scale: 6 }).default("0").notNull(),
    priceInUSD: numeric("priceInUSD", { precision: 8, scale: 2 }).notNull(),
    priceInADA: numeric("priceInADA", { precision: 12, scale: 6 }).notNull(),
    withdrawalMethod: text("withdrawalMethod").notNull(),
    withdrawalAddress: text("withdrawalAddress"),
    customerData_paymentAddress: text("customerData_paymentAddress").notNull(),
    item_quantity: integer("item_quantity").default(1).notNull(),
    checkoutLinkId: text("checkoutLinkId")
      .notNull()
      .references(() => CheckoutLink.id, { onDelete: "cascade", onUpdate: "cascade" }),
    productId: text("productId")
      .notNull()
      .references(() => Product.id, { onDelete: "cascade", onUpdate: "cascade" }),
    customerId: text("customerId").references(() => Customer.id, { onDelete: "set null", onUpdate: "cascade" }),
    customerPaymentPhysicalAddressId: text("customerPaymentPhysicalAddressId").references(() => CustomerPaymentPhysicalAddress.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
    fee_rate: numeric("fee_rate", { precision: 6, scale: 6 }).default("0").notNull(),
    fee_amount: numeric("fee_amount", { precision: 10, scale: 6 }).default("0").notNull(),
    fee_collected: boolean("fee_collected").default(true).notNull(),
    fees_collected: numeric("fees_collected", { precision: 10, scale: 6 }).default("0").notNull(),
  },
  (table) => {
    return {
      checkoutLinkId_idx: index("Payment_checkoutLinkId_idx").using("btree", table.checkoutLinkId),
      customerId_idx: index("Payment_customerId_idx").using("btree", table.customerId),
      customerPaymentPhysicalAddressId_idx: index("Payment_customerPaymentPhysicalAddressId_idx").using("btree", table.customerPaymentPhysicalAddressId),
      productId_idx: index("Payment_productId_idx").using("btree", table.productId),
      totalAmountChargedCurrencyId_idx: index("Payment_totalAmountChargedCurrencyId_idx").using("btree", table.totalAmountChargedCurrencyId),
    }
  },
)

export const WebhookEvent = pgTable(
  "WebhookEvent",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", {
      mode: "date",
      withTimezone: true,
    })
      .notNull()
      .$onUpdateFn(() => sql`now()`),
    type: text("type").notNull(),
    eventType: WebhookEventType("eventType").notNull(),
    paymentId: text("paymentId")
      .notNull()
      .references(() => Payment.id, { onDelete: "restrict", onUpdate: "cascade" }),
    status: text("status").notNull(),
    webhookId: text("webhookId").references(() => Webhook.id, { onDelete: "set null", onUpdate: "cascade" }),
  },
  (table) => {
    return {
      paymentId_idx: index("WebhookEvent_paymentId_idx").using("btree", table.paymentId),
      webhookId_idx: index("WebhookEvent_webhookId_idx").using("btree", table.webhookId),
    }
  },
)

export const _ProductAcceptedCurrencies = pgTable(
  "_ProductAcceptedCurrencies",
  {
    A: text("A")
      .notNull()
      .references(() => Currencies.id, { onDelete: "cascade", onUpdate: "cascade" }),
    B: text("B").notNull(),
  },
  (table) => {
    return {
      AB_unique: uniqueIndex("_ProductAcceptedCurrencies_AB_unique").using("btree", table.A, table.B),
      B_idx: index().using("btree", table.B),
    }
  },
)

export const CustomerCustomInformation = pgTable(
  "CustomerCustomInformation",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    orderIndex: integer("orderIndex").default(0).notNull(),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", {
      mode: "date",
      withTimezone: true,
    })
      .notNull()
      .$onUpdateFn(() => sql`now()`),
    request: text("request").notNull(),
    response: text("response").notNull(),
    paymentId: text("paymentId").notNull(),
  },
  (table) => {
    return {
      paymentId_idx: index("CustomerCustomInformation_paymentId_idx").using("btree", table.paymentId),
    }
  },
)

export const Account = pgTable(
  "Account",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    userId: text("userId")
      .notNull()
      .references(() => User.id, { onDelete: "cascade", onUpdate: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    oauth_token: text("oauth_token"),
    oauth_token_secret: text("oauth_token_secret"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (table) => {
    return {
      provider_providerAccountId_key: uniqueIndex("Account_provider_providerAccountId_key").using("btree", table.provider, table.providerAccountId),
      userId_idx: index("Account_userId_idx").using("btree", table.userId),
    }
  },
)

export const SessionRelations = relations(Session, ({ one }) => ({
  User: one(User, {
    fields: [Session.userId],
    references: [User.id],
  }),
}))

export const UserRelations = relations(User, ({ many }) => ({
  Sessions: many(Session),
  SelectedEnvironments: many(SelectedEnvironment),
  Organizations: many(Organization),
  Accounts: many(Account),
}))

export const EnvironmentRelations = relations(Environment, ({ one, many }) => ({
  Organization: one(Organization, {
    fields: [Environment.organizationId],
    references: [Organization.id],
  }),
  Collections: many(Collection),
  Products: many(Product),
  SelectedEnvironments: many(SelectedEnvironment),
  ShippingPolicies: many(ShippingPolicy),
  NotificationSources: many(NotificationSource),
  Webhooks: many(Webhook),
}))

export const OrganizationRelations = relations(Organization, ({ one, many }) => ({
  Environments: many(Environment),
  SelectedEnvironments: many(SelectedEnvironment),
  User: one(User, {
    fields: [Organization.userId],
    references: [User.id],
  }),
}))

export const CollectionRelations = relations(Collection, ({ one, many }) => ({
  Environment: one(Environment, {
    fields: [Collection.environmentId],
    references: [Environment.id],
  }),
  CheckoutLinks: many(CheckoutLink),
}))

export const ProductRelations = relations(Product, ({ one, many }) => ({
  Currency: one(Currencies, {
    fields: [Product.currencyId],
    references: [Currencies.id],
  }),
  ShippingPolicy: one(ShippingPolicy, {
    fields: [Product.shippingPolicyId],
    references: [ShippingPolicy.id],
  }),
  Environment: one(Environment, {
    fields: [Product.environmentId],
    references: [Environment.id],
  }),
  CustomInformations: many(CustomInformation),
  Payments: many(Payment),
}))

export const CurrenciesRelations = relations(Currencies, ({ many }) => ({
  Products: many(Product),
  Payments: many(Payment),
  _ProductAcceptedCurrencies: many(_ProductAcceptedCurrencies),
}))

export const ShippingPolicyRelations = relations(ShippingPolicy, ({ one, many }) => ({
  Products: many(Product),
  Environment: one(Environment, {
    fields: [ShippingPolicy.environmentId],
    references: [Environment.id],
  }),
}))

export const CustomInformationRelations = relations(CustomInformation, ({ one }) => ({
  Product: one(Product, {
    fields: [CustomInformation.productId],
    references: [Product.id],
  }),
}))

export const CheckoutLinkRelations = relations(CheckoutLink, ({ one, many }) => ({
  Collection: one(Collection, {
    fields: [CheckoutLink.collectionId],
    references: [Collection.id],
  }),
  Payments: many(Payment),
}))

export const SelectedEnvironmentRelations = relations(SelectedEnvironment, ({ one }) => ({
  User: one(User, {
    fields: [SelectedEnvironment.userId],
    references: [User.id],
  }),
  Environment: one(Environment, {
    fields: [SelectedEnvironment.environmentId],
    references: [Environment.id],
  }),
  Organization: one(Organization, {
    fields: [SelectedEnvironment.organizationId],
    references: [Organization.id],
  }),
}))

export const NotificationSourceRelations = relations(NotificationSource, ({ one, many }) => ({
  Environment: one(Environment, {
    fields: [NotificationSource.environmentId],
    references: [Environment.id],
  }),
  Notifications: many(Notification),
}))

export const WebhookRelations = relations(Webhook, ({ one, many }) => ({
  Environment: one(Environment, {
    fields: [Webhook.environmentId],
    references: [Environment.id],
  }),
  WebhookEvents: many(WebhookEvent),
}))

export const NotificationRelations = relations(Notification, ({ one }) => ({
  NotificationSource: one(NotificationSource, {
    fields: [Notification.notificationSourceId],
    references: [NotificationSource.id],
  }),
  Payment: one(Payment, {
    fields: [Notification.paymentId],
    references: [Payment.id],
  }),
}))

export const PaymentRelations = relations(Payment, ({ one, many }) => ({
  Notifications: many(Notification),
  Currency: one(Currencies, {
    fields: [Payment.totalAmountChargedCurrencyId],
    references: [Currencies.id],
  }),
  CheckoutLink: one(CheckoutLink, {
    fields: [Payment.checkoutLinkId],
    references: [CheckoutLink.id],
  }),
  Product: one(Product, {
    fields: [Payment.productId],
    references: [Product.id],
  }),
  Customer: one(Customer, {
    fields: [Payment.customerId],
    references: [Customer.id],
  }),
  CustomerPaymentPhysicalAddress: one(CustomerPaymentPhysicalAddress, {
    fields: [Payment.customerPaymentPhysicalAddressId],
    references: [CustomerPaymentPhysicalAddress.id],
  }),
  WebhookEvents: many(WebhookEvent),
}))

export const CustomerRelations = relations(Customer, ({ many }) => ({
  Payments: many(Payment),
}))

export const CustomerPaymentPhysicalAddressRelations = relations(CustomerPaymentPhysicalAddress, ({ many }) => ({
  Payments: many(Payment),
}))

export const WebhookEventRelations = relations(WebhookEvent, ({ one }) => ({
  Payment: one(Payment, {
    fields: [WebhookEvent.paymentId],
    references: [Payment.id],
  }),
  Webhook: one(Webhook, {
    fields: [WebhookEvent.webhookId],
    references: [Webhook.id],
  }),
}))

export const _ProductAcceptedCurrenciesRelations = relations(_ProductAcceptedCurrencies, ({ one }) => ({
  Currency: one(Currencies, {
    fields: [_ProductAcceptedCurrencies.A],
    references: [Currencies.id],
  }),
}))

export const AccountRelations = relations(Account, ({ one }) => ({
  User: one(User, {
    fields: [Account.userId],
    references: [User.id],
  }),
}))