import type { Network, Product } from "@acme/db"
import { formatNumber } from "@acme/utils"
import type { Prisma } from "@prisma/client"

export function ProductPrice({
  product,
}: {
  product: ((Product & { Environment: { network: Network }; currency: { symbol: string; ticker: string } }) | null) | null
}) {
  if (!product) return null
  return <Price price={product.price} network={product.Environment.network} symbol={product.currency.symbol ?? product.currency.ticker} />
}

export function Price({
  price,
  network,
  symbol,
  precision = 3,
}: {
  price: number | Prisma.Decimal | null
  network: "mainnet" | "testnet" | "preprod"
  symbol: string
  precision?: number
}) {
  return (
    <>
      {network === "mainnet" ? "" : "t"}
      {symbol}
      {formatNumber(price, precision)}
    </>
  )
}
