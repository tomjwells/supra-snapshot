"use client"

import React, { Fragment, useRef } from "react"
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline"
import { Button, Dialog, DropdownMenu, Flex, Text, TextField } from "@radix-ui/themes"

export function DeleteModal({
  open,
  setOpen,
  deleteAction,
  modelName,
}: {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  deleteAction: () => void
  modelName: string
}) {
  return (
    <Dialog.Root open={open}>
      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>Edit profile</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Make changes to your profile.
        </Dialog.Description>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all dark:bg-slate-1 sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-slate-12">
                    Delete {modelName}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-slate-10">
                      Are you sure you want to delete this {modelName?.toLocaleLowerCase()}? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    deleteAction()
                  }}
                  formAction={deleteAction}
                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                >
                  Delete
                </button>

                <Dialog.Close>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-12 shadow-sm ring-1 ring-inset ring-slate-7 hover:bg-gray-2 dark:bg-slate-1 sm:mt-0 sm:w-auto"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </button>
                </Dialog.Close>
              </div>
            </div>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}
