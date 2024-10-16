import { tg } from "@acme/analytics-telegram"
import { AppWalletArgs } from "@acme/cardano/AppWallets"
import { Network, OrganizationTier, prisma } from "@acme/db"
import type { CustomerPaymentPhysicalAddress } from "@acme/db"
import { addressSchema } from "@acme/utils"
import type { UTxO } from "@meshsdk/core"
import { AppWallet, Transaction } from "@meshsdk/core"
import { PaymentStatus, Prisma } from "@prisma/client"
import type { Product } from "@prisma/client"
import { TRPCError } from "@trpc/server"
import { z } from "zod"

import { env } from "../../env.ts"
import { createTRPCRouter, publicProcedure } from "../trpc"
import { sendNotifications } from "./notificationUtils"
import type { FullPayment } from "./paymentsTx"
import { createTransaction } from "./paymentsTx"

function getPrice(item_quantity: number, price: number, price_currency: number, selectedCurrency: number) {
  return item_quantity * price * (price_currency / selectedCurrency)
}
function getShippingPrice(item_quantity: number, price: number, each_additional: number, price_currency: number, selectedCurrency: number) {
  if (!(item_quantity >= 1)) {
    void tg.log("item_quantity must be greater than or equal to 1")
    throw new Error("item_quantity must be greater than or equal to 1")
  }
  return price + (item_quantity - 1) * each_additional * (price_currency / selectedCurrency)
}

export const paymentsRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        checkoutLinkId: z.string(),
        productId: z.string(),
        recipientAddress: z.string(),
        utxos: z.array(z.any()),
        email: z.string().email().optional(),
        address: z.object(addressSchema).optional(),
        currencyId: z.string().uuid(),
        collect_custom_information: z
          .record(
            z.string(),
            z.object({
              orderIndex: z.number().int().min(0),
              request: z.string(),
              response: z.string(),
            }),
          )
          .optional(),
        item_quantity: z.coerce.number().int().min(1).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      void tg.log("🟢 Create Transaction started")
      try {
        void tg.log({ ...input, utxos: undefined })
      } catch (e) {
        console.log("Tried logging to telegram. Probably failed because input is too long. Logging it here instead")
        console.log(JSON.stringify({ ...input, utxos: undefined }, null, 2))
      }
      const checkoutLink = await ctx.prisma.checkoutLink.findFirstOrThrow({
        where: {
          id: input.checkoutLinkId,
        },
        include: {
          collection: {
            include: {
              attributes: {
                include: {
                  values: true,
                },
              },
              variants: {
                include: {
                  product: true,
                },
              },
            },
          },
        },
      })
      if (checkoutLink.status !== "ACTIVE") throw new Error("Checkout link is not active")
      if (checkoutLink.productId && checkoutLink.productId !== input.productId)
        throw new Error(`Checkout link is not for this product (checkoutLink.productId=${checkoutLink.productId}, input.productId=${input.productId})`)
      if (
        checkoutLink.collection &&
        // Ensure input.productId is in the collection (set of variants)
        !checkoutLink.collection.variants.find((variant) => variant.product?.id === input.productId)
      )
        throw new Error(
          `Checkout link is not for this collection (checkoutLink.id=${checkoutLink.id} checkoutLink.collection.id=${checkoutLink.collection.id}, input.productId=${input.productId})`,
        )

      const product = await ctx.prisma.product.findFirstOrThrow({
        where: {
          id: input.productId,
        },
        include: {
          Environment: {
            include: {
              Organization: true,
            },
          },
          currency: true,
          ShippingPolicy: {
            include: {
              ShippingPolicyZone: {
                include: {
                  countries: true,
                  currency: true,
                },
              },
            },
          },
        },
      })
      if (!product.price) throw new Error("Product price is undefined")
      if (!product.currency.lastPrice) throw new Error("Product price is undefined")

      // Check if stock is available
      const item_quantity = product.quantity_variable ? input.item_quantity ?? product.quantity_minimum : 1
      if (stockAvailable(product, item_quantity)) {
        // Try to find customer if we can identify them
        let customer
        if (input.email) {
          customer = await ctx.prisma.customer.upsert({
            where: {
              email: input.email,
            },
            update: {},
            create: {
              email: input.email,
            },
          })
        }
        // Customer Information
        let address: CustomerPaymentPhysicalAddress | undefined
        if (product.collect_address) {
          if (input.address) {
            address = await ctx.prisma.customerPaymentPhysicalAddress.create({
              data: {
                firstName: input.address.firstName,
                lastName: input.address.lastName,
                line1: input.address.addressLine1,
                line2: input.address.addressLine2 ?? "",
                city: input.address.city,
                StateProvinceCounty: input.address.StateProvinceCounty,
                ZipOrPostcode: input.address.ZipOrPostcode,
                country: input.address.country,
              },
            })
          } else {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Physical address is required",
            })
          }
        }

        const totalAmountChargedCurrency = await ctx.prisma.currencies.findFirstOrThrow({
          where: {
            id: input.currencyId,
          },
        })
        console.log(
          "fee_rate",
          env.SUPRA_FEE_RATE,
          new Prisma.Decimal(product.Environment.Organization.tier === OrganizationTier.FREE ? 0 : env.SUPRA_FEE_RATE),
        )

        const subtotal = getPrice(
          item_quantity,
          product.price.toNumber(),
          product.currency.lastPrice.toNumber(),
          totalAmountChargedCurrency.lastPrice.toNumber(),
        )
        const shippingPolicy = product.ShippingPolicy?.ShippingPolicyZone?.find((zone) => zone.countries.find((c) => c.code === address?.country))
        const shipping =
          !address || !shippingPolicy
            ? 0
            : getShippingPrice(
                item_quantity,
                shippingPolicy.price.toNumber(),
                shippingPolicy.each_additional.toNumber(),
                shippingPolicy.currency?.lastPrice.toNumber(),
                totalAmountChargedCurrency.lastPrice.toNumber(),
              )
        const totalAmountCharged = subtotal + shipping

        const payment: FullPayment = await ctx.prisma.payment.create({
          data: {
            totalAmountCharged: totalAmountCharged,
            shippingAmount: shipping,
            totalAmountChargedCurrency: { connect: { id: input.currencyId } },
            priceInADA: item_quantity * product.price.toNumber() * product.currency.lastPrice.toNumber(),
            priceInUSD: item_quantity * product.price.toNumber() * product.currency.lastPriceUSD.toNumber(),
            freeTier: true,
            withdrawalMethod: product.withdrawalMethod,
            withdrawalAddress:
              (product.Environment.network === Network.testnet
                ? product?.Environment.Organization.testnetWithdrawalAddress
                : product?.Environment.Organization.mainnetWithdrawalAddress) ?? undefined,
            customerData_paymentAddress: input.recipientAddress,
            status: PaymentStatus.PENDING,
            network: product.Environment.network,
            customer: customer
              ? {
                  connect: {
                    id: customer?.id,
                  },
                }
              : undefined,
            CustomerPaymentPhysicalAddress: address ? { connect: { id: address?.id } } : undefined,
            customerCustomInformation: {
              create: Object.entries(input.collect_custom_information ?? {}).map(([_key, value]) => {
                return {
                  orderIndex: value.orderIndex,
                  request: value.request,
                  response: value.response,
                }
              }),
            },
            product: {
              connect: {
                id: product?.id,
              },
            },
            checkoutLink: {
              connect: {
                id: checkoutLink.id,
              },
            },
            fee_rate: new Prisma.Decimal(product.Environment.Organization.tier === OrganizationTier.FREE ? 0 : env.SUPRA_FEE_RATE),
            fee_amount: totalAmountCharged * (product.Environment.Organization.tier === OrganizationTier.FREE ? 0 : env.SUPRA_FEE_RATE),
            fee_collected: product.Environment.Organization.tier === OrganizationTier.FREE, 
            item_quantity,
          },
          include: {
            totalAmountChargedCurrency: true,
            product: true,
          },
        })
        const unsignedTx = (await createTransaction(payment, input.utxos as UTxO[])) as string
        await ctx.prisma.payment.update({
          where: {
            id: payment.id,
          },
          data: {
            unsignedTx: unsignedTx.substring(0, 190),
          },
        })

        void tg.log("🟢 Create Transaction completed")
        return { unsignedTx }
      } else {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Product is out of stock",
        })
      }
    }),

  confirmTransaction: publicProcedure
    .input(
      z.object({
        signedTx: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.time("timer1")
      let payment = await verifyInput(input.signedTx)
      void tg.log("🟢 Transaction confirmation started")
      console.timeEnd("timer1")
      // Check if stock is available
      if (stockAvailable(payment.product, payment.item_quantity)) {
        console.time("appWallet")
        const appWallet = new AppWallet(AppWalletArgs[payment.network])
        console.timeEnd("appWallet")

        try {
          const signedTx = await appWallet.signTx(input.signedTx, true)
          const txHash = (await appWallet.submitTx(signedTx)) as string
          void tg.log(`🟢 Transaction confirmation: txHash: ${txHash}`)
          payment = await ctx.prisma.payment.update({
            where: {
              id: payment.id,
            },
            data: {
              transactionHash: txHash,
              status: PaymentStatus.COMPLETE,
            },
            include: {
              product: {
                include: {
                  Environment: true,
                },
              },
            },
          })
          void tg.log("🟢 Transaction confirmation: submitTx succeeded")

          if (payment.fees_collected.toNumber() > 0) {
            await ctx.prisma.payment.updateMany({
              where: {
                product: {
                  environmentId: payment.product.environmentId,
                },
                status: PaymentStatus.COMPLETE,
                fee_collected: false,
              },
              data: {
                fee_collected: true,
              },
            })
          }

          void sendNotifications(payment, payment.product)
          // Update product stock
          await ctx.prisma.product.update({
            where: {
              id: payment.product.id,
            },
            data: {
              inventory_quantity: payment.product.inventory_quantity === 0 ? 0 : payment.product.inventory_quantity - payment.item_quantity,
            },
          })
          void tg.log(`🟢 Transaction confirmation: Status - ${payment.status}`)
          return payment
        } catch (e: unknown) {
          console.log("Error when signing and submitting transaction", e)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Error when signing and submitting transaction",
          })
        }
      } else {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Product is out of stock",
        })
      }
    }),

  logging: publicProcedure
    .input(
      z.object({
        message: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      void tg.log(input.message)
    }),
})

export function stockAvailable(product: Product, item_quantity: number) {
  if (!product.inventory_track) {
    return true
  } else {
    if (product.inventory_quantity - item_quantity > 0) {
      return true
    } else {
      if (product.inventory_continueSelling) {
        return true
      } else {
        return false
      }
    }
  }
  return false
}

async function verifyInput(signedTx: string) {
  const payments = await prisma.payment.findMany({
    where: {
      unsignedTx: {
        contains: signedTx.substring(0, 190),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      product: {
        include: {
          Environment: true,
        },
      },
    },
  })
  return payments[0]
}
