"use client"

import React from "react"
import Link from "next/link"
import { Button } from "@acme/shadcn/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@acme/shadcn/card"
import { cn } from "@acme/shadcn/utils/cn"
import { REGISTER_URL } from "@data/constants"
import { ArrowRightIcon, CheckIcon } from "@heroicons/react/20/solid"
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons"
import { Box, Code, Flex, Heading, Tooltip } from "@radix-ui/themes"

// @ts-expect-error cjs
import { env } from "~/env.ts"

interface PricingCardProps {
  title: string
  href: string
  price: string
  description: string
  features: string[] | React.ReactNode[]
  cta: string
  popular?: boolean
  exclusive?: boolean
  onClick?: () => void
}

const PricingCard = ({ title, price, description, features, cta, popular, exclusive, onClick, href }: PricingCardProps) => (
  <Card
    className={cn(`flex w-80 flex-col justify-between py-1 ${popular ? "border-[#E2CBFF]" : "border-zinc-700"} mx-auto sm:mx-0`, {
      "animate-background-shine bg-white bg-[length:200%_100%] transition-colors dark:bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)]": exclusive,
    })}
  >
    <div>
      <CardHeader className="pb-8 pt-4">
        <CardTitle className="text-md text-zinc-700 dark:text-zinc-300">{title}</CardTitle>
        <div className="flex gap-0.5">
          <h3 className="text-3xl font-bold">{price}</h3>
        </div>
        <CardDescription className="h-12 pt-1.5">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {features.map((feature, key) => (
          <CheckItem key={key} text={feature} />
        ))}
      </CardContent>
    </div>
    <CardFooter className="mt-2">
      <Button
        className="relative inline-flex w-full items-center justify-center rounded-md bg-black px-6 font-medium text-white transition-colors  focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 dark:bg-white dark:text-black"
        onClick={onClick}
        asChild
      >
        <Link href={href} className="flex w-full flex-row justify-between">
          <div className="absolute -inset-0.5 -z-10 rounded-lg bg-gradient-to-b from-[#c7d2fe] to-[#8678f9] opacity-75 blur" />
          {cta}
          <ArrowRightIcon className="ml-2 h-6 w-5" />
        </Link>
      </Button>
    </CardFooter>
  </Card>
)

const CheckItem = ({ text }: { text: string | React.ReactNode }) => (
  <div className="flex gap-2">
    <CheckIcon className="h-6 w-5 flex-none text-green-8" aria-hidden="true" />
    <p className="pt-0.5 text-sm text-zinc-700 dark:text-zinc-300">{text}</p>
  </div>
)

const tiers: PricingCardProps[] = [
  {
    title: "Free Tier",
    href: REGISTER_URL,
    price: "Free",
    description: "Free payment processing for your projects.",
    cta: "Get Started",
    features: [
      `Unlimited transaction volume and number of listings`,
      "High-converting, branded checkout pages",
      "Add country-based shipping prices to your products",
      "Collect customer information such as e-mail, address and custom fields",
      "Live and Test environments to test the checkout process before going live",
    ],
    popular: false,
  },
  {
    title: "Pro",
    href: REGISTER_URL,
    onClick: () => {
      console.log("setting cookie", `tier=pro;${env.NEXT_PUBLIC_NODE_ENV === "development" ? "" : "domain=.suprapayments.io;"}path=/`)
      document.cookie = `tier=pro;${env.NEXT_PUBLIC_NODE_ENV === "development" ? "" : "domain=.suprapayments.io;"}path=/`
    },
    price: `${(100 * parseFloat(env.NEXT_PUBLIC_SUPRA_FEE_RATE as unknown as string)).toFixed(1)}%`,
    description: "Support development on Cardano and improve your conversion rates.",
    cta: "Upgrade now",
    features: [
      "Themeable checkout pages",
      "Multiple team members can manage the same organization",
      "Host checkout pages on your own domain (e.g. checkout.my-website-domain.com)",
      "Offer discounts and promotional codes",
    ],
    popular: true,
    exclusive: true,
  },
  {
    title: "Enterprise",
    href: REGISTER_URL,
    price: "Custom",
    description: "Custom pricing and dedicated support.",
    cta: "Get Started",
    features: [
      "Custom pricing",
      <Flex align="center" gap="4" key={2}>
        Priority support
        <Tooltip content="Email & chat support within 24 hours.">
          <QuestionMarkCircledIcon className="h-4 w-4 text-gray-400" />
        </Tooltip>
      </Flex>,
    ],
    popular: false,
    exclusive: false,
  },
]

export default function page() {
  return (
    <div className="py-12">
      <section className="text-center">
        <div className="mx-auto max-w-4xl text-center">
          <Box mb="3">
            <Code size="4" color="violet">
              Pricing
            </Code>
          </Box>
          <Heading as="h1" className="mt-2 text-5xl font-bold tracking-tight text-black dark:text-white">
            Pricing plans for projects of&nbsp;all&nbsp;sizes
          </Heading>
        </div>
        <br />
      </section>
      <section className="mt-8 flex flex-col justify-center gap-8 sm:flex-row sm:flex-wrap">
        {tiers.map((plan) => (
          <PricingCard key={plan.title} {...plan} />
        ))}
      </section>
    </div>
  )
}
