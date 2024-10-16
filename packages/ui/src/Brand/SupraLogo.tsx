import Image from "next/image"
import Link from "next/link"
import { cn } from "@acme/shadcn/utils/cn"
import { Heading } from "@radix-ui/themes"

export default function SupraLogo({ mode }: { mode?: "light" | "dark" }) {
  return (
    <>
      <Link href="/" passHref>
        <span className={cn("flex cursor-pointer flex-row items-center justify-center", mode)}>
          <span
            style={{
              position: "absolute",
              width: 1,
              height: 1,
              padding: 0,
              margin: -1,
              overflow: "hidden",
              clip: "rect(0, 0, 0, 0)",
              whiteSpace: "nowrap",
              border: 0,
            }}
          >
            Supra homepage
          </span>
          <SupraImageLogoSVG />
          <Heading
            as="h1"
            size="4"
            ml="2"
            weight="bold"
            style={{
              fontFamily:
                "Untitled Sans, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji",
            }}
          >
            Supra
          </Heading>
        </span>
      </Link>
    </>
  )
}

export function SupraImageLogoPNG() {
  return <Image src={require("./icon.png")} height={"35"} width={"35"} alt="Supra" priority />
}
export function SupraImageLogoSVG({ height = 35, width = 35 }: { height?: number; width?: number }) {
  return <Image src={require("./icon.svg")} height={height} width={width} alt="Supra" priority unoptimized />
}


export const SupraImageLogoSVGRaw: string = require("./icon.svg") as string
