import { fileURLToPath } from "node:url"
import createJiti from "jiti"

createJiti(fileURLToPath(import.meta.url))("./src/env.ts")

/** @type {import("next").NextConfig} */
const nextConfig = {
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: ["@acme/analytics", "@acme/auth", "@acme/db", "@acme/shadcn", "@acme/tailwind-config"],
  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    serverActions: { allowedOrigins: ["*.uks1.devtunnels.ms", "localhost:3000"] },
  },
}

// export default require("@next/bundle-analyzer")({ enabled: true })(nextConfig)
export default nextConfig
