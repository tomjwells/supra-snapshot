import type { Metadata } from "next"

import ColorBg from "~/components/ColorBg"
import ContactPanels from "./ContactPanels"

// export const runtime = "nodejs"

export const metadata: Metadata = {
  title: "Supra — Contact",
  description: "Get in touch with the Supra team.",
}

export default function page() {
  return (
    <>
      <ColorBg />
      <ContactPanels />
    </>
  )
}
