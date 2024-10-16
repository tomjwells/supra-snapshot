import baseConfig from "@acme/tailwind-config"
import type { Config } from "tailwindcss"

export default {
  content: [...baseConfig.content, "../../packages/{shadcn,ui}/src/**/*.{ts,tsx}"],
  presets: [baseConfig],
  plugins: [...baseConfig.plugins],
} satisfies Config
