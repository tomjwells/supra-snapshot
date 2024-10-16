"use client"

import * as React from "react"
import type { Country } from "@acme/db"
import { cn } from "@acme/shadcn"
import { Command, CommandGroup, CommandItem } from "@acme/shadcn/command"
import { Badge } from "@radix-ui/themes"
import { Command as CommandPrimitive } from "cmdk"
import { X } from "lucide-react"
import { useFormContext } from "react-hook-form"
import type z from "zod"

import type { ShippingPolicyType, updateTierSchema } from "~/_backend/shippingPolicies"

export default function FancyMultiSelect({
  countries,
  otherTiers,
}: {
  countries: Country[]
  otherTiers: NonNullable<ShippingPolicyType>["ShippingPolicyZone"]
}) {
  const form = useFormContext<z.infer<typeof updateTierSchema>>()

  const inputRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")

  const handleUnselect = React.useCallback((country: Country) => {
    form.setValue(
      "countries",
      form.getValues("countries").filter((c: Country) => c.id !== country.id),
    )
  }, [])

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current
    if (input) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (input.value === "") {
          form.setValue("countries", form.getValues("countries").slice(0, -1))
        }
      }
      if (e.key === "Escape") {
        input.blur()
      }
    }
  }, [])

  const selectables = countries
    .filter(
      (country) =>
        !form
          .getValues("countries")
          .map((c: Country) => c.id)
          .includes(country.id),
    )
    .filter(
      (country) =>
        !otherTiers
          .map((tier) => tier.countries.map((c: Country) => c.id))
          .flat()
          .includes(country.id),
    )

  return (
    <Command onKeyDown={handleKeyDown} className=" overflow-visible bg-transparent">
      <div
        className={cn(
          "rounded-md shadow-sm ring-1 ring-inset ring-slate-7",
          "bg-[rgba(0,_0,_0,_0.25)]",
        )}
      >
        <div className="flex flex-wrap gap-1 p-2">
          {form.watch("countries").map((country: Country) => {
            return (
              <Badge key={country.id} variant="outline" className="!my-[2px] h-5 !py-1">
                {country.name}
                <button
                  className="focus:ring-ring ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(country)
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onClick={() => handleUnselect(country)}
                >
                  <X className="hover:text-foreground h-3 w-3 text-muted-foreground" />
                </button>
              </Badge>
            )
          })}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder="Select countries..."
            className="flex-1 border-none bg-transparent py-1 text-sm outline-none placeholder:text-muted-foreground focus:border-none focus:outline-none"
            style={{
              borderColor: "inherit",
              WebkitBoxShadow: "none",
              boxShadow: "none",
            }}
          />
        </div>
      </div>
      <div className="relative z-[10000] mt-2">
        {open && selectables.length > 0 ? (
          <div className="animate-in absolute top-0 z-[10000]  w-full rounded-md border bg-slate-1 text-popover-foreground shadow-md outline-none">
            <CommandGroup className="z-[10000]  max-h-64 overflow-scroll ">
              {selectables.map((country) => {
                return (
                  <CommandItem
                    key={country.id}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onSelect={(value) => {
                      setInputValue("")
                      form.setValue("countries", [...form.getValues("countries"), country])
                    }}
                    className="cursor-pointer"
                  >
                    {country.name}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </div>
        ) : null}
      </div>
    </Command>
  )
}
