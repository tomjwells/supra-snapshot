"use client"

import React from "react"
import { Callout, Flex, HoverCard, Link, Text } from "@radix-ui/themes"
import { RxInfoCircled } from "react-icons/rx"

export default function TestnetBadge() {
  const [open, setOpen] = React.useState(false)

  return (
    <Flex align="start" direction="row" gap="2">
      <span
        className="dark"
        onMouseEnter={() => {
          setOpen(true)
        }}
        onMouseLeave={() => {
          setOpen(false)
        }}
        onFocus={() => {
          setOpen(true)
        }}
        onBlur={() => {
          setOpen(false)
        }}
      >
        <HoverCard.Root open={open}>
          <HoverCard.Trigger>
            <Callout.Root
              variant="surface"
              color="orange"
              className="!p-[var(--space-2)] !pr-[var(--space-2)] sm:!pr-[var(--space-3)]"
              style={{ backgroundColor: "rgba(245, 165, 36, 0.15)" }}
            >
              <Callout.Icon>
                <RxInfoCircled />
              </Callout.Icon>
              <Callout.Text className="hidden sm:block">Test Mode</Callout.Text>
            </Callout.Root>
          </HoverCard.Trigger>

          <HoverCard.Content>
            <Flex>
              <Text size="2" style={{ maxWidth: 250 }} as="p">
                This is a test checkout page and creates transactions on the Cardano testnet.
                <br />
                <br /> To make a test purchase, set your wallet to use the{" "}
                <Link target="_blank" href="https://docs.suprapayments.io/environments/testnet_wallets">
                  preproduction network
                </Link>
                .
                <br />
                <br />
                Testnet ADA is obtainable from the{" "}
                <Link target="_blank" href="https://testnets.cardano.org/en/testnets/cardano/tools/faucet/">
                  testnet faucet
                </Link>
                .
              </Text>
            </Flex>
          </HoverCard.Content>
        </HoverCard.Root>
      </span>
    </Flex>
  )
}
