import React from "react"
import Image from "next/image"
import { cloudinaryImageSrc } from "@acme/cloudinary/cloudinary-client"
import { BuildingStorefrontIcon, CubeIcon, PlusSmallIcon as PlusIcon, UserGroupIcon, UserIcon } from "@heroicons/react/24/outline"

// Convenience component to make circular icons consistent

export function CircleImageIcon({
  image,
  alt = "",
  size = 10,
  style = "round",
  fallbackIcon,
  border = true,
}: {
  image?: string | null
  alt?: string
  size?: number
  style?: "round" | "square"
  fallbackIcon?: "CubeIcon" | "PlusIcon" | "StoreIcon" | "UserGroupIcon" | "UserIcon"
  border?: boolean
}) {
  const roundClasses = `flex-shrink-0 rounded-full object-cover flex-shrink-0`
  const squareClasses = "rounded-sm  object-cover flex-shrink-0" + (border && " ring-1 ring-slate-7")

  let className = ""
  if (style === "round") {
    className = roundClasses
  } else if (style === "square") {
    className = squareClasses
  }

  let FallbackIcon = UserIcon
  if (fallbackIcon === "CubeIcon") FallbackIcon = CubeIcon
  else if (fallbackIcon === "PlusIcon") FallbackIcon = PlusIcon
  else if (fallbackIcon === "StoreIcon") FallbackIcon = BuildingStorefrontIcon
  else if (fallbackIcon === "UserGroupIcon") FallbackIcon = UserGroupIcon
  else if (fallbackIcon === "UserIcon") FallbackIcon = UserIcon
  else FallbackIcon = UserIcon

  if (image && typeof image === "string" && image !== "") {
    if (image.startsWith("http") || image.startsWith("data:") || typeof image === "string") {
      return (
        <img
          className={className}
          style={{
            width: `${size * 0.25}rem`,
            height: `${size * 0.25}rem`,
          }} 
          src={image.startsWith("http") || image.startsWith("data:") ? image : cloudinaryImageSrc(image)}
          alt={alt}
        />
      )
    } else {
      return (
        <Image
          className={className}
          style={{
            width: `${size * 0.25}rem`,
            height: `${size * 0.25}rem`,
          }} 
          src={cloudinaryImageSrc(image)}
          alt={alt}
          width="0"
          height="0"
          sizes="100vw"
        />
      )
    }
  } else {
    return (
      <span style={{ width: `${size * 0.25}rem`, height: `${size * 0.25}rem` }}>
        <FallbackIcon className={`${className} text-slate-7`} style={{ width: `${size * 0.25}rem`, height: `${size * 0.25}rem` }} />
      </span>
    )
  }
}
