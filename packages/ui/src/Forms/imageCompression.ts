import imageCompression from "browser-image-compression";

const defaultOptions = {
  maxSizeMB: 0.1,
  maxWidthOrHeight: 500,
  useWebWorker: true,
}
export async function compressFile(imageFile: File) {
  return imageCompression(imageFile, defaultOptions)
}