"use client"

import React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@acme/shadcn/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@acme/shadcn/command"
import { Popover, PopoverContent, PopoverTrigger } from "@acme/shadcn/popover"
import { cn } from "@acme/shadcn/utils/cn"
import { Flex } from "@radix-ui/themes"
import { Check, ChevronsUpDown } from "lucide-react"
import { useFormContext } from "react-hook-form"
import type z from "zod"

import type { ProductType } from "~/_backend/products"
import type { checkoutFormSchema } from "~/app/[id]/_providers/CheckoutFormProvider"

export default function ComboboxForm({
  product,
  paymentState,
  selectedCurrency,
}: {
  product: NonNullable<ProductType>
  paymentState: "pay" | "loading"
  selectedCurrency: NonNullable<ProductType>["acceptedCurrencies"][number]
}) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()

  const [open, setOpen] = React.useState(false)
  const form = useFormContext<z.infer<typeof checkoutFormSchema>>()

  // Set the currently accepted currency to products.acceptedCurrencies[0] if the selected currency is not a crypto toke
  if (form.getValues("currency") && !product.acceptedCurrencies.find((c) => c.id === form.getValues("currency"))) {
    form.setValue("currency", product.acceptedCurrencies[0].id)
  }

  if (product.acceptedCurrencies.length <= 1) return null
  return (
    <Flex direction="column" gap="4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger disabled={paymentState === "loading"} asChild>
          <Button
            variant="outline"
            role="combobox"
            className={cn("w-full justify-between font-[400]", !selectedCurrency && "text-muted-foreground")}
            aria-expanded={open}
          >
            {selectedCurrency.label ?? selectedCurrency.ticker}
            <ChevronsUpDown className="z-2 ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full bg-white p-0">
          <Command>
            <CommandInput placeholder="Search tokens..." />
            <CommandEmpty>No token found.</CommandEmpty>
            <CommandGroup
              style={{
                maxHeight: "30vh",
                overflow: "scroll",
              }}
            >
              {product.acceptedCurrencies.map((currency) => (
                <CommandItem
                  value={currency.label}
                  key={currency.ticker}
                  onSelect={() => {
                    setOpen(false)
                    router.push(
                      `${pathname}?${new URLSearchParams({
                        ...Object.fromEntries(params ?? []),
                        token: currency.ticker,
                      }).toString()}`,
                    )
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", currency.ticker === selectedCurrency.ticker ? "opacity-100" : "opacity-0")} />
                  {currency.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </Flex>
  )
}
