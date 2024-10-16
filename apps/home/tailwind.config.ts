import baseConfig from "@acme/tailwind-config"
import type { Config } from "tailwindcss"

export default {
  content: [...baseConfig.content, "../../packages/{shadcn,ui}/src/**/*.{ts,tsx}"],
  presets: [baseConfig],
  theme: {
    extend: {
      ...baseConfig.theme.extend,
      keyframes: {
        ...baseConfig.theme.extend.keyframes,
        "fade-in": {
          from: { opacity: "0", transform: "translateY(-10px)" },
          to: { opacity: "1", transform: "none" },
        },
        "video-fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "video-glow": {
          "0%": {
            opacity: "0",
            "animation-timing-function": "cubic-bezier(0.74,0.25,0.76,1)",
          },
          "10%": {
            opacity: "0.8",
            "animation-timing-function": "cubic-bezier(0.12,0.01,0.08,0.99)",
          },
          "100%": {
            opacity: "0.1",
          },
        },
      },
      animation: {
        ...baseConfig.theme.extend.animation,
        "fade-in": "fade-in 1000ms var(--animation-delay, 0) ease forwards",
        "video-fade-in": "video-fade-in 2500ms var(--animation-delay, 0) ease forwards",
        "video-glow": "video-glow 4100ms 1600ms ease forwards",
      },
    },
  },
  plugins: [...baseConfig.plugins],
} satisfies Config
