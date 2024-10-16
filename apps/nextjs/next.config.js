import { fileURLToPath } from "node:url"
import createJiti from "jiti"

createJiti(fileURLToPath(import.meta.url))("./src/env.ts")

/** @type {import("next").NextConfig} */
const nextConfig = {
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: ["@acme/auth", "@acme/db", "@acme/shadcn", "@acme/ui", "@acme/tailwind-config"],
  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    formats: ["image/avif", "image/webp"],
    domains: ["lingering-sunset-1b10.suprapayments5573.workers.dev", "replicate.delivery", "res.cloudinary.com"],
  },
  // From https://prismaio.notion.site/Prisma-Vercel-Edge-Functions-and-Middleware-9e6f2a3bdb2a409caa9f8e4dba9e9bae#40206fa61d6445d6b6625bee866f296a
  webpack(config) {
    config.experiments ??= {}
    config.experiments.asyncWebAssembly = true

    return config
  },
  experimental: {
    serverActions: { allowedOrigins: ["*.uks1.devtunnels.ms", "localhost:3001"] },
  },
}

// export default require("@next/bundle-analyzer")({ enabled: true })(nextConfig)
export default nextConfig
