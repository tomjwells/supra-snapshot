"use client";

import React from "react";
import { Flex } from "@radix-ui/themes";
import { useFormContext } from "react-hook-form";



import { CircleImageIcon } from "../List";
import { compressFile } from "./imageCompression";


export default function EditImageItem({
  edit,
  image,
  alt,
  style = "round",
  fallbackIcon,
}: {
  edit: boolean
  image: string | null
  alt: string | null
  style?: "round" | "square"
  fallbackIcon?: "CubeIcon" | "PlusIcon" | "StoreIcon" | "UserGroupIcon" | "UserIcon"
}) {
  const form = useFormContext()
  const [newImage, setNewImage] = React.useState("")

  return (
    <Flex direction="row" align="center" gap="4">
      <CircleImageIcon image={newImage || image} alt={alt} style={style} size={24} fallbackIcon={fallbackIcon} />
      {edit && (
        <div>
          <label className=" cursor-pointer rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-slate-12 shadow-sm ring-1 ring-inset ring-slate-7 hover:bg-gray-2 dark:bg-slate-1">
            <input
              type="file"
              className="hidden"
              onChange={async (e) => {
                const reader = new FileReader()
                if (e && e.target && e.target.files?.[0]) {
                  const original = e.target.files[0]
                  reader.readAsDataURL(original)
                  reader.onload = () => {
                    setNewImage(reader.result as string)
                  }
                  if (original) {
                    form.setValue("imageData", "compressing")
                    const compressedFile = await compressFile(original)
                    reader.readAsDataURL(compressedFile)
                    reader.onload = () => {
                      form.setValue("imageData", reader.result as string)
                      setNewImage(reader.result as string)
                      console.log("Finished compressing!", "Before", original.size / 1024 / 1024, "After", compressedFile.size / 1024 / 1024)
                    }
                  }
                }
              }}
            />
            <input className="hidden" {...form.register?.("imageData")} />
            <input className="hidden" type="hidden" value={image ?? ""} {...form.register?.("image")} />
            Change
          </label>
          <p className="mt-2 text-xs leading-5 text-gray-400">JPG, GIF or PNG.</p>
        </div>
      )}
    </Flex>
  )
}