import { fileURLToPath } from "node:url"
import createJiti from "jiti"

createJiti(fileURLToPath(import.meta.url))("./src/env.ts")

/** @type {import("next").NextConfig} */
const nextConfig = {
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: ["@acme/analytics", "@acme/chekcout-api-pages", "@acme/db", "@acme/shadcn", "@acme/ui", "@acme/tailwind-config"],
  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  // Webpack config for meshjs
  webpack: function (config, options) {
    config.experiments.asyncWebAssembly = true
    config.experiments.layers = true
    return config
  },
  images: {
    formats: ["image/avif", "image/webp"],
    domains: ["lingering-sunset-1b10.suprapayments5573.workers.dev", "replicate.delivery", "res.cloudinary.com"],
  },
  output: "standalone",
  experimental: {
    serverActions: { allowedOrigins: ["*.uks1.devtunnels.ms", "localhost:3002"] },
  },
}

export default nextConfig
