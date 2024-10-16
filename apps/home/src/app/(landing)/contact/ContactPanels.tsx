import React from "react"
import { CONTACT_URL, TWITTER_URL } from "@data/constants"
import { CalendarIcon } from "@radix-ui/react-icons"
import { Container, Flex, Section, Separator, Text } from "@radix-ui/themes"

import { HoverCard } from "../_components/Community/HoverCard"

export default function ContactPanels() {
  return (
    <Section>
      <Flex direction="column" pb="9">
        <Text align="center">Please choose one of the options below.</Text>
      </Flex>
      <Container size="4">
        <Flex direction="column" gap="8">
          <Flex direction="row" gap="4" width="auto">
            <Flex align="center" justify="center" gap="4" width="auto" className="flex-1">
              <ContactPane text="Get in touch on X" href={TWITTER_URL} />
            </Flex>
            <Flex align="center" justify="center" gap="4" width="auto">
              <Separator orientation="vertical" size="4" />
            </Flex>
            <Flex align="center" justify="center" gap="4" width="auto" className="flex-1">
              <ContactPane text="Arrange a meeting" href={CONTACT_URL} />
            </Flex>
          </Flex>
        </Flex>
      </Container>
    </Section>
  )
}

export function ContactPane({ text, href }: { text: string; href: string }) {
  return (
    <HoverCard href={href} variant="active">
      <Flex
        direction="column"
        align="center"
        justify="center"
        style={{
          height: "150px",
          width: "170px",
        }}
      >
        <Flex direction="column" align="center" justify="center" gap="4" width="auto">
          {href === TWITTER_URL && (
            <svg viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" width="30px" height="30px">
              <path
                fill="currentColor"
                d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
              />
            </svg>
          )}
          {href === CONTACT_URL && <CalendarIcon />}
          <Text size="3" style={{ lineHeight: "23px" }} align="center" className="max-w-[160px] text-slate-11">
            {text}
          </Text>
        </Flex>
      </Flex>
    </HoverCard>
  )
}
