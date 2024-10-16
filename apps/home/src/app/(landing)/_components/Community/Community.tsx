"use client"

import React from "react"
import { DISCORD_URL, GITHUB_URL, TWITTER_URL } from "@data/constants"
import { Box, Container, Grid, Heading, Section, Text } from "@radix-ui/themes"

import StarsIllustration from "~/components/stars.svg"
import { HoverCard } from "./HoverCard"

const communityCards = [
  {
    title: "Twitter",
    subtext: "For announcements, blog posts, and tips on using Supra.",
    href: TWITTER_URL,
    icon: (
      <svg viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" width="30px" height="30px">
        <path
          fill="currentColor"
          d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
        />
      </svg>
    ),
  },
  {
    title: "Discord",
    href: DISCORD_URL,
    subtext: "To get involved in the community, ask questions, and share tips.",
    icon: (
      <svg width="30" height="31" viewBox="0 0 30 31" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M20.3899 23.9519C21.1526 24.8925 22.0678 25.9858 22.0678 25.9858C27.391 25.8172 29.5878 22.5222 29.8042 22.1977C29.8162 22.1797 29.8221 22.1709 29.8221 22.1722C29.8221 14.062 26.1611 7.47729 26.1611 7.47729C22.5255 4.75695 19.0424 4.83322 19.0424 4.83322L18.6865 5.24C23.0085 6.53661 25.017 8.44339 25.017 8.44339C22.3729 7.01966 19.7797 6.3078 17.3645 6.02814C15.5339 5.82475 13.7797 5.8756 12.2289 6.07899C12.0957 6.07899 11.9819 6.09836 11.8537 6.1202C11.835 6.12337 11.816 6.1266 11.7967 6.12983C10.9068 6.23153 8.74581 6.53661 6.02547 7.73153C5.08479 8.13831 4.52547 8.44339 4.52547 8.44339C4.52547 8.44339 6.61022 6.43492 11.1865 5.13831L10.9323 4.83322C10.9323 4.83322 7.47462 4.75695 3.81361 7.47729C3.81361 7.47729 0.152588 14.062 0.152588 22.1722C0.152588 22.1722 2.28818 25.8332 7.90683 26.0112C7.90683 26.0112 8.8475 24.8925 9.61022 23.9264C6.3814 22.9603 5.16106 20.9519 5.16106 20.9519C5.16106 20.9519 5.4153 21.1298 5.87293 21.3841C5.88864 21.3841 5.90435 21.3938 5.92607 21.4072C5.93949 21.4155 5.9552 21.4252 5.97462 21.4349C6.01276 21.4603 6.05089 21.4794 6.08903 21.4985C6.12717 21.5175 6.1653 21.5366 6.20344 21.562C6.83903 21.918 7.47462 22.1976 8.05937 22.4264C9.10174 22.8586 10.3475 23.24 11.7967 23.5197C13.7034 23.8756 15.9407 24.0027 18.3814 23.5451C19.5763 23.3163 20.7967 22.9858 22.0678 22.4519C22.9577 22.1214 23.9492 21.6383 24.9916 20.9519C24.9916 20.9519 23.7204 23.0112 20.3899 23.9519ZM16.9323 17.0112C16.9323 15.4603 18.0763 14.2146 19.5255 14.2146C20.9492 14.2146 22.1187 15.4603 22.1187 17.0112C22.1187 18.562 20.9746 19.8078 19.5255 19.8078C18.1017 19.8078 16.9323 18.562 16.9323 17.0112ZM7.65259 17.0112C7.65259 15.4603 8.79666 14.2146 10.2458 14.2146C11.695 14.2146 12.8645 15.4603 12.839 17.0112C12.839 18.562 11.695 19.8078 10.2458 19.8078C8.82208 19.8078 7.65259 18.562 7.65259 17.0112Z"
          fill="#7289DA"
        />
      </svg>
    ),
  },
  {
    title: "GitHub",
    subtext: "To file issues, request features, and contribute, check out our GitHub.",
    href: GITHUB_URL,
    icon: (
      <svg width="30" height="30" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M7.49936 0.850006C3.82767 0.850006 0.849976 3.8273 0.849976 7.50023C0.849976 10.4379 2.75523 12.9306 5.39775 13.8104C5.73047 13.8712 5.85171 13.6658 5.85171 13.4895C5.85171 13.3315 5.846 12.9135 5.84273 12.3587C3.99301 12.7604 3.60273 11.4671 3.60273 11.4671C3.30022 10.6988 2.86423 10.4942 2.86423 10.4942C2.26044 10.0819 2.90995 10.0901 2.90995 10.0901C3.57742 10.137 3.9285 10.7755 3.9285 10.7755C4.52167 11.7916 5.48512 11.4981 5.86396 11.3279C5.92438 10.8984 6.09625 10.6053 6.28608 10.4391C4.80948 10.2709 3.25695 9.70063 3.25695 7.15241C3.25695 6.42615 3.51618 5.83298 3.94157 5.368C3.87299 5.1998 3.64478 4.52375 4.00689 3.60807C4.00689 3.60807 4.56494 3.42926 5.83538 4.28941C6.36568 4.14204 6.93477 4.06856 7.50018 4.0657C8.06518 4.06856 8.63386 4.14204 9.16498 4.28941C10.4346 3.42926 10.9918 3.60807 10.9918 3.60807C11.3548 4.52375 11.1266 5.1998 11.0584 5.368C11.4846 5.83298 11.7418 6.42615 11.7418 7.15241C11.7418 9.70716 10.1868 10.2693 8.70571 10.4338C8.94412 10.6392 9.15681 11.045 9.15681 11.6655C9.15681 12.5542 9.14865 13.2715 9.14865 13.4895C9.14865 13.6675 9.26867 13.8745 9.60588 13.8095C12.2464 12.9282 14.15 10.4375 14.15 7.50023C14.15 3.8273 11.1723 0.850006 7.49936 0.850006Z"
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
        ></path>
      </svg>
    ),
  },
]

export default function Community() {
  return (
    <Section size={{ initial: "1", md: "3" }} my="4">
      <Container size="3" className="[&>*]:!max-w-[740px] [&>*]:px-[var(--space-5)]">
        <Heading as="h1" size="8" mb="3" align="center" weight="medium" style={{ fontSize: "35px", letterSpacing: "-1.19px" }}>
          Join our fast-growing community
        </Heading>
        <Heading as="h2" size="5" mb="8" align="center" weight="regular" style={{ fontSize: "21px", letterSpacing: "-0.336px", color: "var(--gray-subtitle)" }}>
          Get involved in our community. Everyone is welcome!
        </Heading>

        <Grid
          columns={{
            initial: "1",
            md: "3",
          }}
          gap={{
            initial: "3",
            md: "4",
          }}
          mx={{
            initial: "5",
            md: "-4",
          }}
        >
          {communityCards.map((card) => (
            <CommunityCard key={card.title} icon={card.icon} title={card.title} subtext={card.subtext} href={card.href} />
          ))}
        </Grid>
      </Container>
    </Section>
  )
}

function CommunityCard({ icon, title, subtext, href }: { icon: React.ReactNode; title: string; subtext: string; href: string }) {
  return (
    <HoverCard href={href} onClick={() => {}}>
      <Box mb="5">{icon}</Box>
      <Heading size="4" as="h4" style={{ lineHeight: 1, fontWeight: 500 }} mb="2">
        {title}
      </Heading>
      <Text style={{ fontSize: "15px", lineHeight: "23px" }} className="text-slate-11">
        {subtext}
      </Text>
    </HoverCard>
  )
}
