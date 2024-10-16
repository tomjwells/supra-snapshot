"use client"

import React from "react"
import { EnvelopeIcon } from "@heroicons/react/20/solid"
import { useFormContext } from "react-hook-form"
import type z from "zod"

import type { checkoutFormSchema } from "~/app/[id]/_providers/CheckoutFormProvider"

export default function EmailFormSection({ setScreen, nextScreen }: { setScreen: React.Dispatch<React.SetStateAction<string>>; nextScreen: string }) {
  const [_submitClicked, setSubmitClicked] = React.useState(false)

  const form = useFormContext<z.infer<typeof checkoutFormSchema>>()

  return (
    <div className="flex w-full flex-col items-center justify-center space-y-8 align-middle">
      <span className="w-64">
        <label htmlFor="email" className="block text-sm font-medium leading-6 text-slate-12">
          Email
        </label>
        <div className="relative mt-2 rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="email"
            name="email"
            id="email"
            className={`block w-full rounded-md border-0 py-1.5 pl-10 text-slate-12 ring-1 ring-inset ring-slate-7 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  sm:text-sm sm:leading-6 ${
              // !error
              !form.formState.errors.email?.message ? "focus:ring-indigo-600" : "text-red-900 ring-red-300 placeholder:text-red-300 focus:ring-red-500"
            }`}
            placeholder="Email"
            onChange={(e) => {
              console.log(e.target.value)
              form.setValue("email", e.target.value, { shouldValidate: true })
              console.log("onChange")
            }}
          />
        </div>
      </span>
      <button
        type="button"
        className="flex w-40 items-center justify-center  rounded-md border border-transparent bg-slate-12 py-2 text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
        onClick={async () => {
          setSubmitClicked(true)
          const result = await form.trigger("email", { shouldFocus: true })

          if (result) {
            setScreen(nextScreen)
          }
        }}
      >
        Next
      </button>
    </div>
  )
}
