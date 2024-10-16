import { env } from "./env.ts"

export function cloudinaryImageSrc(publicId: string | null) {
  if (!publicId) return ""
  if (publicId.startsWith("http")) {
    return publicId
  } else {
    return `https://res.cloudinary.com/${env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto/q_auto/v1/${publicId}`
  }
}
