import React from "react"
import Link from "next/link"
import SupraLogo from "@acme/ui/Brand/SupraLogo"
import { FooterLinks } from "@data/constants"
import { Box, Container, Flex, Grid, Heading, Separator, Text } from "@radix-ui/themes"

import { ExternalIcon } from "~/components/ExternalIcon"

export default function Footer() {
  return (
    <footer className="sticky top-[100vh]">
      <Container size="4" className="[&_div]:max-w-[106rem]">
        <Box
          pb={{ initial: "1", md: "9" }}
          pt={{ initial: "1", md: "4" }}
          px={{
            initial: "6",
            lg: "4",
          }}
        >
          <Flex mb={{ initial: "1", md: "9" }} justify="center">
            <Separator style={{ width: "45px" }} />
          </Flex>
          <Grid
            columns={{
              initial: "1",
              md: "6",
            }}
            gap={{
              initial: "6",
              md: "3",
            }}
          >
            <span />
            <Flex align="center" justify={{ initial: "center", md: "start" }} height="9">
              <SupraLogo />
            </Flex>
            {FooterLinks.map((section, i) => (
              <Box key={i}>
                <Heading as="h2" size="3" style={{ fontWeight: 500, lineHeight: "20px" }}>
                  {section.header}
                </Heading>
                {section.links.map((link, i) => (
                  <FooterLink key={i} {...link} />
                ))}
              </Box>
            ))}
          </Grid>
        </Box>
      </Container>
    </footer>
  )
}

function FooterLink({
  href,
  text,
  external = false,
  onClick,
  externalIcon,
  ...props
}: {
  href: string
  text: string
  external?: boolean
  onClick?: () => void
  externalIcon?: boolean
}) {
  return (
    <Text as="p" size="3" mt="3" style={{ lineHeight: "20px", fontSize: "15px" }}>
      <Link
        href={href}
        className="text-slate-11"
        target={external ? "_blank" : ""}
        onClick={onClick}
        style={{ display: "inline-flex", alignItems: "center" }}
        {...props}
      >
        {text}
        {externalIcon && (
          <span className="ml-1 text-slate-8">
            <ExternalIcon />
          </span>
        )}
      </Link>
    </Text>
  )
}
