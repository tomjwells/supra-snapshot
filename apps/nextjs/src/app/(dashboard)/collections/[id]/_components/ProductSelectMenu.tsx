"use client"

import * as React from "react"
import { Button, cn } from "@acme/shadcn"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@acme/shadcn/command"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@acme/shadcn/form"
import { Popover, PopoverContent, PopoverTrigger } from "@acme/shadcn/popover"
import { ProductAvatarItem } from "@acme/ui/Table/TableAvatarItem"
import { Check, ChevronsUpDown } from "lucide-react"
import { useSession } from "next-auth/react"
import { useForm, useFormContext } from "react-hook-form"

import { api, RouterOutputs } from "~/utils/api"

export function ProductSelectMenu({ index, currentProductId }: { index: number; currentProductId: string | undefined }) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const form = useFormContext()

  const [products] = api.products.list.useSuspenseQuery()

  const widthClass = "w-[300px]"

  if (products.length === 0) return null
  return (
    <FormField
      control={form.control}
      name={`variants.${index}.productId`}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger defaultValue={currentProductId} asChild>
              <FormControl>
                <Button variant="outline" role="combobox" aria-expanded={open} className={cn(widthClass, " justify-between")}>
                  {field.value ? <ProductAvatarItem product={products.find((product) => product.id === field.value)} size={8} /> : "Select a product"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className={cn(widthClass, "p-0")}>
              <Command>
                <CommandInput placeholder="Search products..." />
                <CommandEmpty>No products found.</CommandEmpty>
                <CommandGroup>
                  {products.map((product) => (
                    <CommandItem
                      value={product.name + "_" + product.id ?? ""}
                      key={product.id}
                      onSelect={() => {
                        form.setValue(`variants.${index}.productId`, product.id === field.value ? "" : product.id)
                        setOpen(false)
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", field.value === product.id ? "opacity-100" : "opacity-0")} />
                      <ProductAvatarItem product={product} />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </FormItem>
      )}
    />
  )
}
