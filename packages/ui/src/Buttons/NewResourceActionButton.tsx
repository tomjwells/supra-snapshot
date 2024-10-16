"use client"

import React from "react"
import { cn } from "@acme/shadcn"
import { PlusSmallIcon } from "@heroicons/react/20/solid"
import { Button } from "@radix-ui/themes"
import { useFormStatus } from "react-dom"

import { LoadingButtonSpinner } from "../Buttons"

export default function NewResourceActionButton({ resource }: { resource: string }) {
  const { pending } = useFormStatus()
  return (
    <Button disabled={pending}>
      <div className="relative">
        <LoadingButtonSpinner isLoading={pending} />
        <div className={cn(pending && "invisible", "z-10 flex flex-row truncate whitespace-nowrap")}>
          <PlusSmallIcon className="-ml-1.5 h-5 w-5" aria-hidden="true" />
          New {resource}
        </div>
      </div>
    </Button>
  )
}
