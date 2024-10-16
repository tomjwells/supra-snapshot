"use client"

import { Suspense } from "react"
import { Box, Container, Heading, Section } from "@radix-ui/themes"
import { Tweet } from "react-tweet"

const tweetIds = ["1710265641939198383", "1710332938791895328", "1710006541309612068", "1710097910354804911", "1725318465009967556"]

export default function WallOfLove() {
  return (
    <Section id="features" size={{ initial: "2", md: "3" }} className="relative">
      <Container
        size="4"
        px={{
          initial: "4",
          sm: "8",
          md: "6",
          lg: "0",
        }}
      >
        <Box px="3">
          <Heading as="h1" size="8" mb="3" align="center" weight="medium" style={{ fontSize: "35px", letterSpacing: "-1.19px" }}>
            Wall Of Love
          </Heading>
          <Heading
            as="h2"
            size="5"
            mb="8"
            align="center"
            weight="regular"
            style={{ fontSize: "21px", letterSpacing: "-0.336px", color: "var(--gray-subtitle)" }}
          >
            Learn what the community have been saying about us
          </Heading>
          <Suspense>
            <div className="relative origin-top scale-95 columns-1 gap-8 overflow-hidden transition-all sm:columns-2 lg:columns-3 xl:columns-3 [&>*]:!m-0 [&>*]:!mb-8">
              {tweetIds.map((tweetId) => (
                <Tweet key={tweetId} id={tweetId} />
              ))}
            </div>
          </Suspense>
        </Box>
      </Container>
    </Section>
  )
}

function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j: number = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}
