import { Suspense } from "react"
import type { Metadata } from "next"
import { COPY_SUBTITLE, COPY_TITLE } from "@data/constants"
import { Flex, Separator as RadixSeparator } from "@radix-ui/themes"

import ColorBg from "~/components/ColorBg"
import Community from "./_components/Community/Community"
import DashboardSection from "./_components/DashboardSection"
import FeaturesGrid from "./_components/FeaturesGrid"
import { Hero } from "./_components/Hero"
import { HeroVideo } from "./_components/HeroVideo"
import StatsAtAGlance from "./_components/Stats/Stats"
import WallOfLove from "./_components/WallOfLove"
import FAQ from "./pricing/_components/FAQ/FAQ"

export const metadata: Metadata = {
  title: "Supra — A no-code platform for accepting Payments on Cardano.",
  description: "Free Cardano Payments Processing Tool for Accepting Payments for Products and Services Online",
}

export default function page() {
  return (
    <>
      <ColorBg />
      <Hero title={COPY_TITLE} subtitle={COPY_SUBTITLE} />
      <HeroVideo />
      <Separator />
      <Suspense>
        <DashboardSection />
      </Suspense>

      <Suspense>
        <Separator />
        <WallOfLove />
      </Suspense>

      <Suspense>
        <Separator />
        <FeaturesGrid />
      </Suspense>

      <Suspense>
        <Separator />
        <FAQ />
      </Suspense>
      <Suspense>
        <Separator />
        <Community />
      </Suspense>
    </>
  )
}

export function Separator() {
  return (
    <Flex justify="center">
      <RadixSeparator style={{ width: "45px" }} />
    </Flex>
  )
}
