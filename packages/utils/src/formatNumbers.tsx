import type { Currency, Prisma } from "@prisma/client"

export const currencySymbol = {
  ADA: "₳",
  DJED: "𓊽", // https://djed.xyz/favicon.ico // 𓊽 // DJED
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CNY: "¥",
  CHF: "₣",
  CAD: "$",
  AUD: "$",
  NZD: "$",
  ZAR: "R",
  INR: "₹",
  BTC: "₿",
  ETH: "Ξ",
  LTC: "Ł",
  DASH: "Đ",
  XRP: "XRP",
  XMR: "ɱ",
  NEO: "NEO",
  XLM: "XLM",
  DOGE: "Ð",
  USDT: "USDT",
  USDC: "USDC",
  DAI: "DAI",
}

export function formatCurrency(
  amount: number | string | Prisma.Decimal | null | undefined,
  network: "mainnet" | "testnet",
  shortName: Currency | "USD" | null | "",
  round = 0, // round should be integer for number d.p.
) {
  if (!amount && amount != 0) return "--"
  // Allow shortName = "" to allow no symbol
  const symbol = shortName ? currencySymbol[shortName] : ""

  const formatter = new Intl.NumberFormat("en-US", {
    currency: "USD",
    currencyDisplay: "symbol",
    style: "currency",
    // These options are needed to round to whole numbers if that's what you want.
    minimumFractionDigits: round, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    maximumFractionDigits: round, // (causes 2500.99 to be printed as $2,501)
  })
  const parts = formatter.formatToParts(Number(amount))

  return `${parts
    .map((x) => (x.type === "currency" ? `${network === "testnet" && shortName !== "USD" ? "t" : ""}${symbol}` : x.value))
    .join("")
    .trim()}`
}
export function formatNumber(
  number: number | string | Prisma.Decimal | null | undefined,
  sigFig = 0, // sigFig should be integer for number of significant figures.
) {
  if (!number && number != 0) return "--"

  // Convert the number to a Number object and format it to the desired number of significant figures.
  const sigFigNumber = Number(number).toPrecision(sigFig)

  const formatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    // These options are needed to round to whole numbers if that's what you want.
    minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    maximumFractionDigits: 20, // Set this to a large number just so it shows eough decimals e.g. for iBTC it can be 0.00004567
  })
  const formattedNumber = formatter.format(Number(sigFigNumber))

  return formattedNumber
}

export function explorerLink(explorer: string, network: string, txHash?: string | null) {
  if (!txHash) return "--"

  let link: string
  switch (explorer) {
    case "cardanoscan":
      link = `https://${network === "mainnet" ? "" : network + "."}cardanoscan.io/transaction/${txHash}`
      break
    case "explorer.cardano":
      link = `https://${network === "mainnet" ? "" : network + "."}explorer.cardano.org/en/tx/${txHash}`
      break
    default:
      link = `https://${network === "mainnet" ? "" : network + "."}cardanoscan.io/transaction/${txHash}`
      break
  }
  return link
}
