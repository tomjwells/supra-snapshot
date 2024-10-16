import React from "react"
import { cn } from "@acme/shadcn/utils/cn"
import { TextArea, TextField } from "@radix-ui/themes"

// A styled input for consistency

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  rows?: number
  size?: "1" | "2" | "3" | undefined
}

export type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  rows?: number
  size?: "1" | "2" | "3" | undefined
}

const Input = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps | TextAreaProps>(({ className, type, rows = 1, size, ...props }, ref) => {
  if (rows === 1) {
    return <TextField.Root type={type} className={cn(className)} ref={ref as React.Ref<HTMLInputElement>} {...(props as InputProps)} size={size ?? "2"} />
  } else {
    return <TextArea className={cn("sm:max-w-md [&>*]:[resize:vertical]", className)} {...(props as TextAreaProps)} size={size ?? "2"} rows={rows} />
  }
})
Input.displayName = "Input"

export { Input }
