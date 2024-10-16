import { tg } from "@acme/analytics-telegram"
import { AppWalletArgs } from "@acme/cardano/AppWallets"
import { prisma } from "@acme/db"
import type { Quantity, Unit, UTxO } from "@meshsdk/core"
import { AppWallet, largestFirst, largestFirstMultiAsset, Transaction } from "@meshsdk/core"
import type { Currencies, Payment, Product } from "@prisma/client"
import { Network, PaymentStatus, Prisma as PrismaClient } from "@prisma/client"
import { TRPCError } from "@trpc/server"

// @ts-expect-error cjs
import { env } from "../../env.ts"

export const adaToLovelace = (ada: number | PrismaClient.Decimal): number => parseInt(((typeof ada === "number" ? ada : ada.toNumber()) * 1e6).toFixed(0))

export const lovelaceToAda = (lovelace: number): PrismaClient.Decimal => new PrismaClient.Decimal((lovelace / 1e6).toString())
export const quantityFromAmount = (amount: number, currency: Currencies): Quantity => (amount * Math.pow(10, currency.decimals)).toFixed(0).toString()

export function isErrorWithMessage(e: unknown): e is { message: string } {
  return typeof e === "object" && e !== null && "message" in e && typeof (e as { message: string }).message === "string"
}

export type FullPayment = Payment & { totalAmountChargedCurrency: Currencies; product: Product }


async function buildInstantTx(payment: FullPayment, utxos: UTxO[]) {

  const totalAmountCharged = payment.totalAmountCharged.toNumber()
  const fee_amount = payment.fee_amount.toNumber()
  const currency = payment.totalAmountChargedCurrency
  if (!totalAmountCharged) throw new Error("totalAmountCharged is falsy")
  if (!fee_amount && fee_amount !== 0) throw new Error("fee_amount is falsy")
  if (!currency) throw new Error("currency is falsy")

  const appWallet: AppWallet = new AppWallet(AppWalletArgs[payment.network])
  const tx = new Transaction({ initiator: appWallet })

  const withdrawalAddress = payment.withdrawalAddress
  const quantity = quantityFromAmount(totalAmountCharged, currency)
  const ticker = currency.ticker
  const unit = (payment.network === Network.mainnet ? currency.mainnetUnit : currency.preprodUnit) ?? "lovelace"
  const recipientAddress = payment.customerData_paymentAddress

  console.log("tx.sendAssets", {
    withdrawalAddress,
    quantity,
    ticker,
    network: payment.network,
    unit,
    recipientAddress,
  })
  void tg.log("🟢 tx.sendAssets", {
    checkoutLinkId: payment.checkoutLinkId,
    productId: payment.productId,
    withdrawalAddress,
    quantity,
    ticker,
    network: payment.network,
    unit,
  })

  const uncollectedFee = await calculateUncollectedFees(payment)

  if (currency.ticker === "ADA") {
    const minUTxO = 0.96975
    if (uncollectedFee === 0) {
      tx.sendLovelace(withdrawalAddress, quantityFromAmount(totalAmountCharged - uncollectedFee, currency))
    } else if (uncollectedFee > 0) {
      if (uncollectedFee >= minUTxO) {
        tx.sendLovelace(withdrawalAddress, quantityFromAmount(totalAmountCharged - uncollectedFee, currency))
        tx.sendLovelace(
          payment.network === Network.mainnet ? env.SUPRA_CARDANO_WALLET_ADDRESS_MAINNET : env.SUPRA_CARDANO_WALLET_ADDRESS_TESTNET,
          quantityFromAmount(uncollectedFee, currency),
        )
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            fees_collected: new PrismaClient.Decimal(uncollectedFee),
          },
        })
      } else {
        // In this case we send the merchant the full amount, and collect the fee in a later transaction
        tx.sendLovelace(withdrawalAddress, quantityFromAmount(totalAmountCharged, currency))
      }
    }
  } else {
    const amountToMerchant = payment.totalAmountCharged.toNumber() - payment.fee_amount.toNumber()
    const amountToSupra = payment.fee_amount.toNumber()
    console.log({
      amountToMerchant,
      amountToSupra,
      currency_ticker: currency.ticker,
    })
    tx.sendAssets(withdrawalAddress, [
      {
        quantity: quantityFromAmount(amountToMerchant, currency),
        unit,
      },
    ])
    if (amountToSupra > 0) {
      tx.sendAssets(payment.network === Network.mainnet ? env.SUPRA_CARDANO_WALLET_ADDRESS_MAINNET : env.SUPRA_CARDANO_WALLET_ADDRESS_TESTNET, [
        {
          quantity: quantityFromAmount(amountToSupra, currency),
          unit,
        },
      ])
    }
    // No fee delay for tokens
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        fee_collected: true,
      },
    })
  }

  console.log("utxos", JSON.stringify(utxos, null, 2))
  const assetMap = new Map<Unit, Quantity>()
  assetMap.set(unit, quantityFromAmount(totalAmountCharged, currency))
  let selectedUtxos: UTxO[]
  if (currency.ticker === "ADA") {
    selectedUtxos = largestFirst(quantityFromAmount(totalAmountCharged, currency), utxos, true)
  } else {

    selectedUtxos = largestFirstMultiAsset(assetMap, utxos, true)
    if (parseFloat(selectedUtxos[0].output.amount.filter((a) => a.unit === "lovelace")[0]?.quantity) < 5e6) {
      selectedUtxos = [...selectedUtxos, ...largestFirst((5e6).toString(), utxos, true)]
    }
  }

  tx.setTxInputs(selectedUtxos)
  tx.setChangeAddress(recipientAddress)
  return tx
}

export async function createTransaction(payment: FullPayment, utxos: UTxO[]) {
  console.log("createTransaction", { currency: payment.totalAmountChargedCurrency })
  // Create transaction
  if (payment.totalAmountCharged) {
    const selectedUtxos = utxos
    console.log("selectedUtxos", selectedUtxos)

    let tx
    if (payment.withdrawalMethod === "instant") {
      console.log("Instant payment")
      try {
        tx = await buildInstantTx(payment, selectedUtxos)
        console.log("buildInstantTx completed")
        const unsignedTx = await tx.build()
        console.log("unsignedTx looks Ok!")
        return unsignedTx
      } catch (e: unknown) {
        // Assume it is becuse of minUTXO error
        console.log("Error creating transaction: e=", e)
        // Check if error is a string. If it is not, it is probably a geniuine error
        if (typeof e === "string" || e instanceof String) {
          const str: string = e as string
          const regex = /Value \d+ less than the minimum UTXO value (\d+)/
          const match = str.match(regex)
          const minUtxoLovelace = match ? match[1] : null
          if (minUtxoLovelace) {
            return await handleMinUtxoError(selectedUtxos, payment, minUtxoLovelace)
          } else if (e.includes("invalid checksum")) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "invalid checksum error",
              cause: e,
            })
          } else {
            console.log("String Error is not a minUTXO error!")
            console.log(e)
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Unknown error when creating transaction.",
              cause: e,
            })
          }
        } else {
          console.log("Error is not a string!")
          console.error(e)
          if (isErrorWithMessage(e) && e.message.includes("Insufficient input in transaction. shortage: {ada in inputs:")) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Error creating transaction: Insufficient ada.",
              cause: e,
            })
          } else if (isErrorWithMessage(e) && e.message.includes("Insufficient input in transaction. shortage: {policy id:")) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Error creating transaction: Insufficient native token.",
              cause: e,
            })
          } else {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Unknown error when creating transaction.",
              cause: e,
            })
          }
        }
      }
    }
  }
  return ""
}

async function handleMinUtxoError(selectedUtxos: UTxO[], payment: FullPayment, minUtxoLovelace: string) {
  const tx = await buildInstantTx(payment, selectedUtxos)
  const unsignedTx = await tx.build()
  return unsignedTx
}

async function calculateUncollectedFees(payment: FullPayment) {
  // Calculate total uncollected fees for this environment
  const allPaymentsSinceFeeWasPaid = await prisma.payment.findMany({
    where: {
      product: {
        environmentId: payment.product.environmentId,
      },
      status: PaymentStatus.COMPLETE,
      fee_collected: false,
    },
    include: {
      totalAmountChargedCurrency: true,
    },
  })

  // Calculate the total amount not collected in ADA
  return allPaymentsSinceFeeWasPaid.reduce(
    (acc, payment) => acc + payment.fee_amount.toNumber() * payment.totalAmountChargedCurrency.lastPrice.toNumber(),
    payment.fee_amount.toNumber() * payment.totalAmountChargedCurrency.lastPrice.toNumber(),
  )
}
