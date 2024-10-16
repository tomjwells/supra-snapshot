import { BlockfrostProvider } from "@meshsdk/core"

import { env } from "./env.ts"

const mainnetProvider = new BlockfrostProvider(env.BLOCKFROST_API_KEY_MAINNET)
const testnetProvider = new BlockfrostProvider(env.BLOCKFROST_API_KEY_TESTNET)

// Merchant Funds Wallets
const mainnetWalletArgs = {
  networkId: 1,
  fetcher: mainnetProvider,
  submitter: mainnetProvider,
  key: {
    type: "mnemonic" as const,
    words: env.SUPRA_MAINNET_WALLET_MNEMONIC,
  },
}

const testnetWalletArgs = {
  networkId: 0,
  fetcher: testnetProvider,
  submitter: testnetProvider,
  key: {
    type: "mnemonic" as const,
    words: env.SUPRA_TESTNET_WALLET_MNEMONIC,
  },
}

const AppWalletArgs = {
  mainnet: mainnetWalletArgs,
  testnet: testnetWalletArgs,
}
export { AppWalletArgs }
