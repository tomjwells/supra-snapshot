"use client"

import type { ReactNode } from "react"
import { cn } from "@acme/shadcn/utils/cn"
import { Spinner } from "@radix-ui/themes"
import { useFormStatus } from "react-dom"

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
        "flex h-12 w-full items-center justify-center space-x-2 rounded-md border px-4 text-sm transition-all focus:outline-none",
        props.disabled || loading || pending
          ? "cursor-not-allowed border-gray-2 bg-gray-2 text-gray-9"
          : {
              "border-black bg-black text-white hover:border-slate-1 hover:bg-slate-1 hover:text-white": variant === "primary",
              "border-slate-2 bg-slate-2 text-gray-100 hover:border-slate-4 hover:bg-slate-4 hover:text-white": variant === "secondary",
              "border-blue-500 bg-blue-500 text-white hover:bg-white hover:text-blue-500": variant === "success",
              "border-red-500 bg-red-500 text-white hover:bg-white hover:text-red-500": variant === "danger",
            },
        props.className,
      )}
      disabled={props.disabled || loading || pending}
      {...props}
    >
      {loading || pending ? <Spinner /> : icon ? icon : null}
      <p>{text}</p>
    </button>
  )
}
