"use server"

import type { UploadApiResponse } from "cloudinary"

// @ts-expect-error cjs
import { env } from "./env.ts"

export async function updateImage(imageData: string, public_id: string, folder: string): Promise<UploadApiResponse> {
  const timestamp = `${Math.floor(Date.now() / 1000)}`
  const signatureString = `folder=${folder}&timestamp=${timestamp}${env.CLOUDINARY_API_SECRET}`
  const signature = await digestMessage(signatureString)
  const url = `https://api.cloudinary.com/v1_1/${env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`
  const formData = new FormData()
  formData.append("folder", folder)
  formData.append("file", imageData)
  formData.append("api_key", env.CLOUDINARY_API_KEY)
  formData.append("timestamp", timestamp)
  formData.append("signature", signature)
  const response = await fetch(url, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`Image upload failed: ${response.statusText}`)
  }

  const uploadResult = await response.json()
  if (uploadResult && public_id) {
    const deletedResult: { result: string } = (await deleteImage(public_id)) as { result: string }
    console.log("image deleted:", deletedResult, public_id)
  }
  console.log("Image upload succeeded", uploadResult)
  return uploadResult
}

export async function deleteImage(public_id: string) {
  const timestamp = `${Math.floor(Date.now() / 1000)}`
  const signatureString = `invalidate=true&public_id=${public_id}&timestamp=${timestamp}${env.CLOUDINARY_API_SECRET}`
  const signature = await digestMessage(signatureString)
  const url = `https://api.cloudinary.com/v1_1/${env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/destroy`

  const formData = new FormData()
  formData.append("public_id", public_id)
  formData.append("invalidate", "true")
  formData.append("api_key", env.CLOUDINARY_API_KEY)
  formData.append("timestamp", timestamp)
  formData.append("signature", signature)
  formData.append("api_key", env.CLOUDINARY_API_KEY)

  const response = await fetch(url, { method: "POST", body: formData })
  if (!response.ok) throw new Error(`Image delete failed: ${response.statusText}`)
  console.log("Image delete succeeded")
  return (await response.json()) as { result: string }
}

// Making the web crypto API usable
async function digestMessage(message: string) {
  const hashBuffer = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(message))
  return Array.prototype.map.call(new Uint8Array(hashBuffer), (x) => ("00" + x.toString(16)).slice(-2)).join("")
}
