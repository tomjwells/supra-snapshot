import React from "react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@acme/shadcn/utils/cn"
import { Code, Heading } from "@radix-ui/themes"

import StarsIllustration from "~/components/stars.svg"

export const runtime = "nodejs"

export default function Page() {
  return (
    <div className="flex h-screen flex-row items-center justify-center align-middle">
      <div className="relative h-[850px] w-[1100px] border p-8 ">
        <div className="flex h-full flex-col justify-end align-bottom">
          <div className="p-16">
            <SupraLogo />
          </div>
          <div className=" mx-12 mt-12 flex flex-1 flex-col text-2xl">
            <div className="text-gradient">A comprehensive payments solution, tailor-made for Cardano.</div>
            <ul className="ml-12 list-disc pt-4 [&>*]:mb-5">
              <li>
                <div className="text-gradient">Accept payments for your projects in most popular Cardano tokens</div>
              </li>
              <li>
                <div className="text-gradient">Compatible with all major Cardano wallets, for a great user experience</div>
              </li>
              <li>
                <div className="text-gradient">Add shipping and track inventory</div>
              </li>
              <li>
                <div className="text-gradient">Receive payments directly to your Cardano address</div>
              </li>
            </ul>
          </div>
          <span className="text-gradient flex flex-row justify-center p-4 pb-16">
            <div style={{ fontSize: "1.875rem", lineHeight: "2.25rem" }}>Come check us out, visit https://suprapayments.io</div>
          </span>
        </div>
      </div>
    </div>
  )
}

function SupraLogo({ mode }: { mode?: "light" | "dark" }) {
  const size = 96
  return (
    <>
      <Link href="/" passHref>
        <span className={cn("flex cursor-pointer flex-row items-center justify-center", mode)}>
          <SupraImageLogoSVG height={size} width={size} />
          <Heading
            as="h1"
            size="9"
            ml="3"
            weight="bold"
            style={{
              fontFamily: "Untitled Sans, apple-system, sans-serif",
              letterSpacing: "-0.06em",
              fontVariantNumeric: "proportional-nums",
              fontWeight: 500,
              textIndent: "6.0px",
              height: "84px",
              paddingRight: "8px",
            }}
            className={cn("!sm:text-[2rem] text-gradient lg: !text-5xl  md:!text-[4.0rem] lg:!text-[4.5rem]")}
          >
            Supra Payments
          </Heading>
        </span>
      </Link>
    </>
  )
}

export function SupraImageLogoSVG({ height = 35, width = 35 }: { height?: number; width?: number }) {
  return <Image src={require("./icon.svg")} height={height} width={width} alt="Supra" priority unoptimized />
}
