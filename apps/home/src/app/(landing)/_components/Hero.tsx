import React from "react"
import { cn } from "@acme/shadcn/utils/cn"
import { DOCS_URL, REGISTER_URL } from "@data/constants"
import { Container, Flex, Heading, Section } from "@radix-ui/themes"

import { BlackButton, WhiteButton } from "../../../components/TailwindButtons"

export function Hero({ title, subtitle }: { title: React.ReactNode; subtitle: React.ReactNode }) {
  return (
    <Section pt={{ initial: "4", sm: "9" }} pb={{ initial: "6", sm: "9" }} mb={{ initial: "0", sm: "6" }}>
      <Container
        size={{
          initial: "4",
          xs: "2",
          sm: "3",
          md: "4",
          xl: "4",
        }}
        mt="4"
        px={{
          initial: "6",
          md: "0",
        }}
      >
        <Flex direction="column" align="center" justify="center">
          <Heading
            as="h1"
            align={{
              initial: "left",
              sm: "center",
            }}
            style={{
              fontFamily: "Untitled Sans, apple-system, sans-serif",
              letterSpacing: "-0.06em",
              fontVariantNumeric: "proportional-nums",
              textIndent: "-1.76px",
              marginBlockEnd: "15px",
              fontWeight: 500,
              paddingBottom: "20px", 
            }}
            className={cn(
              "!text-5xl md:!text-6xl lg:!text-7xl xl:!text-8xl",
              "bg-gradient-to-b from-white to-neutral-600 bg-clip-text font-sans  font-bold text-transparent ",
              "animate-fade-in translate-y-[-1rem] opacity-0 [--animation-delay:400ms]",
            )}
            mr={{
              initial: "1",
              md: "0",
            }}
          >
            {title}
          </Heading>
          <Heading
            as="h2"
            align={{
              initial: "left",
              sm: "center",
            }}
            my="4"
            style={{
              fontSize: "21px",
              fontWeight: 400,
              lineHeight: "30px",
              letterSpacing: "-.016em",
              fontFamily: "Untitled Sans, apple-system, sans-serif",
              color: "var(--gray-subtitle)",
            }}
            className="animate-fade-in max-w-xl translate-y-[-1rem] opacity-0 [--animation-delay:800ms]"
          >
            {subtitle}
          </Heading>
        </Flex>
        <Flex
          direction={{
            initial: "column",
            xs: "row",
          }}
          pt="4"
          gap="4"
          align="center"
          justify="center"
          className={cn("animate-fade-in translate-y-[-1rem] opacity-0 [--animation-delay:1200ms]")}
        >
          <WhiteButton href={REGISTER_URL} text="Try Supra" icon="ArrowRightIcon" withShadow className="animate transition-all duration-200 ease-in-out" />
        </Flex>
      </Container>
    </Section>
  )
}
