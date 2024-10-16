import { ImageResponse } from "next/og"
import { cloudinaryImageSrc } from "@acme/cloudinary/cloudinary-client"
import { prisma } from "@acme/db"

import "@radix-ui/themes/styles.css"

import { blue, blueDark, gray, grayDark, green, greenDark, indigo, indigoDark, red, redDark, teal, tealDark } from "@radix-ui/colors"

import getFonts from "./FontHelper"

export const runtime = "nodejs" // Edge size limit

export const contentType = "image/png"

// Image metadata
export const size = {
  width: 1200,
  height: 630,
}

const HSLToRGB = (input: string) => {
  console.log("input", input)
  const regex = /hsl\(\s*(\d+)\s*,\s*(\d+(?:\.\d+)?%)\s*,\s*(\d+(?:\.\d+)?%)\)/g
  const res = regex.exec(input)?.slice(1)
  if (!res) return "rgb(255,255,255)"
  const h = parseInt(res[0])
  const s = parseFloat(res[1]) / 100
  const l = parseFloat(res[2]) / 100
  const k = (n: number) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return `rgb(${Math.round(255 * f(0))}, ${Math.round(255 * f(8))}, ${Math.round(255 * f(4))})`
}

// Image generation
export default async function OGImage({ params: { id } }: { params: { id: string } }) {
  const checkoutLink = await prisma.checkoutLink.findUniqueOrThrow({
    where: { id },
    include: {
      product: {
        include: { Environment: { include: { Organization: true } } },
      },
    },
  })

  const imgUrl = cloudinaryImageSrc(checkoutLink.product?.image ?? "")

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          backgroundImage: "linear-gradient(to bottom, #dbf4ff, #fff1f1)",
          fontSize: 60,
          letterSpacing: -2,
          fontWeight: 700,
          textAlign: "center",
        }}
      >
        <img
          src={imgUrl}
          alt={checkoutLink.product?.name || ""}
          width={200}
          height={200}
          style={{
            borderRadius: 20,
            objectFit: "cover",
          }}
        />
        <div
          style={{
            backgroundImage: `linear-gradient(90deg, rgb(0, 124, 240), rgb(0, 223, 216))`,
            backgroundClip: "text",
            "-webkit-background-clip": "text",
            color: "transparent",
            paddingLeft: 20,
          }}
        >
          {checkoutLink.product?.name}
        </div>
     
      </div>
    ),
    // ImageResponse options
    {
      ...size,
      alt: checkoutLink.product?.name,
      fonts: await getFonts(),
    },
  )
}
