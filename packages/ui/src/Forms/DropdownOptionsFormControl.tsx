import React from "react"
import type { FieldValues, RegisterOptions } from "react-hook-form"
import { Controller, useFormContext } from "react-hook-form"

export default function DropdownOptionsFormControl({
  name,
  options,
  defaultValue,
  rules,
}: {
  name: string
  options: Record<string, string>
  defaultValue?: string | number | null
  rules?: Omit<RegisterOptions<FieldValues, string>, "setValueAs" | "disabled" | "valueAsNumber" | "valueAsDate"> | undefined
}) {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      render={({ field }) => (
        <select
          {...field}
          className="block w-48 rounded-md border-slate-7 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
        >
          {Object.entries(options).map(([key, val]) => (
            <option
              key={key}
              value={key}
              className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            >
              {val.charAt(0).toUpperCase() + val.slice(1)}
            </option>
          ))}
        </select>
      )}
    />
  )
}
