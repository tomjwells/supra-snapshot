"use client"

import { cn } from "@acme/shadcn/utils/cn"
import { PencilIcon } from "@heroicons/react/24/solid"
import { Button, Flex } from "@radix-ui/themes"
import { useFormStatus } from "react-dom"

export function EditButton({ setEdit }: { setEdit: React.Dispatch<React.SetStateAction<boolean>> }) {
  return (
    <span className="rounded-md bg-transparent shadow-sm">
      <Button variant="surface" size="2" color="gray" onClick={() => setEdit(true)}>
        <PencilIcon width="16" height="16" className="text-gray-400" />
        Edit
      </Button>
    </span>
  )
}

export function CancelButton({ setEdit }: { setEdit: React.Dispatch<React.SetStateAction<boolean>> }) {
  return (
    <button
      type="button"
      className={cn(
        "rounded-md px-3 py-2 ",
        "bg-white hover:bg-gray-1 dark:bg-slate-1",
        "text-sm font-semibold leading-6 text-slate-12",
        "relative inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold ring-1 ring-inset ring-slate-5",
      )}
      onClick={() => setEdit(false)}
    >
      Cancel
    </button>
  )
}

export function SaveButton({ isLoading = false, disabled = false, formAttribute }: { isLoading?: boolean; disabled?: boolean; formAttribute?: string }) {
  const { pending } = useFormStatus() 
  console.log({ pending })
  return (
    <Button variant="solid" size="2" form={formAttribute} disabled={disabled || isLoading}>
      {isLoading || pending ? (
        <span className="flex flex-row justify-center" style={{ width: "31.805px" }}>
          <svg className="h-4 w-4 animate-spin" width="24" height="24" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        </span>
      ) : (
        "Save"
      )}
    </Button>
  )
}

export function EditButtons({
  edit,
  setEdit,
  formAttribute,
  isLoading = false,
  disabled = false,
  variantAction,
}: {
  edit: boolean
  setEdit: React.Dispatch<React.SetStateAction<boolean>>
  formAttribute?: string
  isLoading?: boolean
  disabled?: boolean
  variantAction?: React.ReactNode
}) {
  return (
    <Flex align="center" justify="between" gap="4">
      {edit ? (
        <>
          <CancelButton setEdit={setEdit} />
          <SaveButton formAttribute={formAttribute} disabled={disabled} isLoading={isLoading} />
        </>
      ) : (
        <>
          {variantAction}
          <EditButton setEdit={setEdit} />
        </>
      )}
    </Flex>
  )
}
