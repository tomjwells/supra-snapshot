"use client"

import type { ReactNode } from "react"
import { cn } from "@acme/shadcn/utils/cn"
import { useFormStatus } from "react-dom"

import LoadingSpinner from "./icons/loading-spinner"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string
  variant?: "primary" | "secondary" | "success" | "danger"
  loading?: boolean
  icon?: ReactNode
}

export default function Button({ text, variant = "primary", loading, icon, ...props }: ButtonProps) {
  const { pending, data, method, action } = useFormStatus()

  return (
    <button
      type={props.onClick ? "button" : "submit"}
      className={cn(
        "flex h-10 w-full items-center justify-center space-x-2 rounded-md border px-4 text-sm transition-all focus:outline-none",
        props.disabled || loading || pending
          ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
          : {
              "border-black bg-black text-white hover:bg-white hover:text-black": variant === "primary",
              "border-gray-200 bg-white text-gray-500 hover:border-black hover:text-black": variant === "secondary",
              "border-blue-500 bg-blue-500 text-white hover:bg-white hover:text-blue-500": variant === "success",
              "border-red-500 bg-red-500 text-white hover:bg-white hover:text-red-500": variant === "danger",
            },
        props.className,
      )}
      disabled={props.disabled || loading || pending}
      {...props}
    >
      {loading || pending ? <LoadingSpinner /> : icon ? icon : null}
      <p>{text}</p>
    </button>
  )
}
