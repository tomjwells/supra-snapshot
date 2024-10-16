import type { Metadata } from "next"

import ColorBg from "~/components/ColorBg"
import FAQ from "./_components/FAQ/FAQ"
import CnPricingSection from "./cnPricingSection"

// export const runtime = "nodejs"

export const metadata: Metadata = {
  title: "Supra — Pricing",
  description: "No-code payment processing on Cardano, for projects of all sizes",
}

export default function Page() {
  return (
    <>
      <ColorBg />
      <CnPricingSection />
      <FAQ />
    </>
  )
}
