"use client"

import React from "react"
import { FormControl, FormField, FormItem, FormLabel } from "@acme/shadcn/form"
import { Checkbox } from "@radix-ui/themes"
import { useFormContext } from "react-hook-form"

// Based on https://ui.shadcn.com/docs/components/checkbox#form
export default function CheckboxInput({
  registerName,
  defaultValue,
  disabled,
  label,
}: {
  registerName: string
  registerOptions?: Record<string, unknown>
  defaultValue?: boolean
  disabled?: boolean
  label?: string
}) {
  const form = useFormContext()
  return (
    <FormField
      control={form.control}
      name={registerName}
      defaultValue={defaultValue}
      disabled={disabled}
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
          <FormControl>
            <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={disabled} />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>{label}</FormLabel>
          </div>
        </FormItem>
      )}
    />
  )
}
