import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";





export const env = createEnv({
  server: {
    BLOCKFROST_API_KEY_MAINNET: z.string().length(39).startsWith("mainnet"),
    BLOCKFROST_API_KEY_TESTNET: z.string().length(39).startsWith("preprod"),
    SUPRA_MAINNET_WALLET_MNEMONIC: z.preprocess((str) => String(str).split(" "), z.array(z.string()).length(24)),
    SUPRA_TESTNET_WALLET_MNEMONIC: z.preprocess((str) => String(str).split(" "), z.array(z.string()).length(24)),
  },

  shared: {
    NODE_ENV: z.enum(["development", "production"]),
  },

  experimental__runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
  },
})