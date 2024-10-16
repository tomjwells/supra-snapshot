// @ts-ignore cjs
import { env } from "~/env.ts"

export const GITHUB_URL = "https://github.com/suprapayments"
export const TWITTER_URL = "https://twitter.com/tomjwells"
export const DISCORD_URL = "https://discord.gg/3MawVjc8"
export const CONTACT_URL = "https://cal.com/supra-app-niazz0/30min"

export const APP_DOMAIN = env.NEXT_PUBLIC_NODE_ENV === "production" ? "https://app.suprapayments.io" : "http://localhost:3001"
export const REGISTER_URL = `/signup`
export const DOCS_URL = "https://docs.suprapayments.io"
export const LOGIN_URL = `/login`

export const videos = {
  // Hero
  pay_with_ada: "https://pub-a8d1f7e18f9144438a7368ed8975dc95.r2.dev/screendemo.mp4",
  pay_with_djed: "/landing/videos/pay_with_djed.mp4",
}

export const FooterLinks = [
  {
    header: "Overview",
    links: [
      {
        href: "https://docs.suprapayments.io",
        text: "Docs",
      },
      {
        href: "/pricing#faq",
        text: "FAQ",
      },
      {
        href: "/pricing",
        text: "Pricing",
      },
    ],
  },
  {
    header: "Docs",
    links: [
      {
        href: "https://docs.suprapayments.io/products/adding_new_products",
        text: "Adding Products",
        external: true,
      },
      {
        href: "https://docs.suprapayments.io/checkout_links/creating_checkout_links",
        text: "Checkout Links",
        external: true,
      },
      {
        href: "https://docs.suprapayments.io/environments/testnet_wallets",
        text: "Test Environments",
        external: true,
      },
    ],
  },
  {
    header: "Community",
    links: [
      {
        href: TWITTER_URL,
        text: "X",
        external: true,
        externalIcon: true,
      },
      {
        href: DISCORD_URL,
        text: "Discord",
        external: true,
        externalIcon: true,
      },
      {
        href: GITHUB_URL,
        text: "GitHub",
        external: true,
        externalIcon: true,
      },
    ],
  },
]

export const COPY_TITLE = (
  <>
    Payments Infrastructure,
    <br />
    for Cardano.
  </>
)

export const COPY_SUBTITLE = "Automate your billing operations on Cardano, so you can focus on growth."