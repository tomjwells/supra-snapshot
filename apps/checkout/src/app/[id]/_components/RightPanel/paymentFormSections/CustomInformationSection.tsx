import React from "react";
import { CustomInformationFieldType } from "@acme/db";
import { cn } from "@acme/shadcn/utils/cn";
import { get } from "lodash";
import { useFormContext } from "react-hook-form";
import type z from "zod";



import type { ProductType } from "~/_backend/products";
import type { checkoutFormSchema } from "~/app/[id]/_providers/CheckoutFormProvider";


export default function CustomInformationSection({
  product,
  setScreen,
  nextScreen,
}: {
  product: NonNullable<ProductType>
  setScreen: React.Dispatch<React.SetStateAction<string>>
  nextScreen: string
}) {
  const form = useFormContext<z.infer<typeof checkoutFormSchema>>()

  const [index, setIndex] = React.useState(0)

  return (
    <div className="flex w-full flex-col items-center justify-center space-y-8 align-middle">
      <span className="w-72">
        {product.collect_custom_information.map((question, questionIndex) => {
          return questionIndex === index ? <QuestionAndresponse question={question} index={index} key={question.id} /> : null
        })}
      </span>
      <button
        type="button"
        className="flex w-40 items-center justify-center  rounded-md border border-transparent bg-slate-12 py-2 text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
        onClick={() => {
          const responseLabel = `collect_custom_information.${product.collect_custom_information[index].id}.response`
          const value = form.getValues(responseLabel)
          if (value.length === 0) {
            form.setError(responseLabel, { type: "required", message: "This field is required" })
          } else {
            if (index === product.collect_custom_information.length - 1) {
              setScreen(nextScreen)
            } else {
              setIndex(index + 1)
            }
          }
        }}
      >
        Next
      </button>
    </div>
  )
}

function QuestionAndresponse({ question, index }: { question: Product["collect_custom_information"][number]; index: number }) {
  const form = useFormContext<z.infer<typeof checkoutFormSchema>>()

  const responseLabel = `collect_custom_information.${question.id}.response`
  return (
    <>
      <label htmlFor="email" className="block text-sm font-medium leading-6 text-slate-12">
        {question.request}
      </label>
      <input type="hidden" {...form.register(`collect_custom_information.${question.id}.request`, { value: question.request })} />
      <input
        type="hidden"
        {...form.register(`collect_custom_information.${question.id}.orderIndex`, {
          valueAsNumber: true,
        })}
        defaultValue={index}
      />
      <div className="relative mt-2 rounded-md shadow-sm">
        {question.field_type === CustomInformationFieldType.INPUT && (
          <input
            className={cn(
              "block w-full rounded-md border-0 py-1.5 text-slate-12 ring-1 ring-inset ring-slate-7 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  sm:text-sm sm:leading-6",
              !get(form.formState.errors, responseLabel) ? "focus:ring-indigo-600" : "text-red-900 ring-red-300 placeholder:text-red-300 focus:ring-red-500",
            )}
            {...form.register(responseLabel, { required: true })}
          />
        )}
        {question.field_type === CustomInformationFieldType.TEXTAREA && (
          <textarea
            className={cn(
              "block w-full rounded-md border-0 py-1.5 text-slate-12 ring-1 ring-inset ring-slate-7 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  sm:text-sm sm:leading-6",
              !get(form.formState.errors, responseLabel) ? "focus:ring-indigo-600" : "text-red-900 ring-red-300 placeholder:text-red-300 focus:ring-red-500",
            )}
            {...form.register(responseLabel, { required: true })}
          />
        )}
      </div>
    </>
  )
}