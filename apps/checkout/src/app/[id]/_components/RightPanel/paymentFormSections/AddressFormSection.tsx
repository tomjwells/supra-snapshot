"use client"

import React from "react"
import { cn } from "@acme/shadcn/utils/cn"
import DropdownOptionsFormControl from "@acme/ui/Forms/DropdownOptionsFormControl"
import { useFormContext } from "react-hook-form"
import type { FieldErrors, FieldValues, UseFormSetValue } from "react-hook-form"

import type { ProductType } from "~/_backend/products"

export default function AddressFormSection({ product, setScreen }: { product: ProductType; setScreen: React.Dispatch<React.SetStateAction<string>> }) {
  const {
    register: _register,
    watch: _watch,
    getValues: _getValues,
    trigger,
    formState: { errors },
    setValue,
  } = useFormContext()

  return (
    <div className="">
      <h2 className="text-lg font-medium text-slate-12">Shipping information</h2>

      <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
        <div>
          <label htmlFor="first-name" className="block text-sm font-medium text-gray-11">
            First name
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="first-name"
              name="first-name"
              autoComplete="given-name"
              className={cn(
                "block w-full rounded-md border-slate-7 shadow-sm  sm:text-sm",
                !errors.firstName?.message
                  ? "focus:border-indigo-500 focus:ring-indigo-500"
                  : "border-red-300 text-red-900 placeholder:text-red-300 focus:border-red-500 focus:ring-0 ",
              )}
              onChange={(e) => {
                setValue("firstName", e.target.value, { shouldValidate: true })
              }}
            />
          </div>
        </div>

        <div>
          <label htmlFor="last-name" className="block text-sm font-medium text-gray-11">
            Last name
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="last-name"
              name="last-name"
              autoComplete="family-name"
              className={cn(
                "block w-full rounded-md border-slate-7 shadow-sm sm:text-sm",
                !errors.lastName?.message
                  ? "focus:border-indigo-500 focus:ring-indigo-500"
                  : "border-red-300 text-red-900 placeholder:text-red-300 focus:border-red-500 focus:ring-0 ",
              )}
              onChange={(e) => {
                setValue("lastName", e.target.value, { shouldValidate: true })
              }}
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="address" className="block text-sm font-medium text-gray-11">
            Street Address
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="address"
              id="address"
              autoComplete="street-address"
              className={cn(
                "block w-full rounded-md border-slate-7 shadow-sm  sm:text-sm",
                !errors.addressLine1?.message
                  ? "focus:border-indigo-500 focus:ring-indigo-500"
                  : "border-red-300 text-red-900 placeholder:text-red-300 focus:border-red-500 focus:ring-0 ",
              )}
              onChange={(e) => {
                setValue("addressLine1", e.target.value, {
                  shouldValidate: true,
                })
              }}
            />
          </div>
          <div className="mt-4">
            <input
              type="text"
              name="apartment"
              id="apartment"
              className={cn(
                "block w-full rounded-md border-slate-7 shadow-sm  sm:text-sm",
                !errors.addressLine2?.message
                  ? "focus:border-indigo-500 focus:ring-indigo-500"
                  : "border-red-300 text-red-900 placeholder:text-red-300 focus:border-red-500 focus:ring-0 ",
              )}
              onChange={(e) => {
                setValue("addressLine2", e.target.value, {
                  shouldValidate: true,
                })
              }}
            />
          </div>
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-11">
            City
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="city"
              id="city"
              autoComplete="address-level2"
              className={cn(
                "block w-full rounded-md border-slate-7 shadow-sm  sm:text-sm",
                !errors.city?.message
                  ? "focus:border-indigo-500 focus:ring-indigo-500"
                  : "border-red-300 text-red-900 placeholder:text-red-300 focus:border-red-500 focus:ring-0 ",
              )}
              onChange={(e) => {
                setValue("city", e.target.value, { shouldValidate: true })
              }}
            />
          </div>
        </div>

        <div>
          <label htmlFor="region" className="block text-sm font-medium text-gray-11">
            State / Province
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="region"
              id="region"
              autoComplete="address-level1"
              className={cn(
                "block w-full rounded-md border-slate-7 shadow-sm  sm:text-sm",
                !errors.StateProvinceCounty?.message
                  ? "focus:border-indigo-500 focus:ring-indigo-500"
                  : "border-red-300 text-red-900 placeholder:text-red-300 focus:border-red-500 focus:ring-0",
              )}
              onChange={(e) => {
                setValue("StateProvinceCounty", e.target.value, {
                  shouldValidate: true,
                })
              }}
            />
          </div>
        </div>

        <PostcodeField setValue={setValue} errors={errors} />

        <CountryField
          options={
            product?.ShippingPolicy?.ShippingPolicyZone.map((zone) => zone.countries)
              .flat()
              .reduce(
                (acc: Record<string, string>, c) => {
                  acc[c.code] = c.name
                  return acc
                },
                {} as Record<string, string>,
              ) ?? {}
          }
        />
        <div className="align-center flex flex-row justify-center sm:col-span-2">
          <button
            type="button"
            className="flex w-full items-center justify-center  rounded-md border border-transparent bg-slate-12 py-2 text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            onClick={async () => {
              const result = await trigger(
                ["firstName", "lastName", "addressLine1", "addressLine2", "city", "StateProvinceCounty", "ZipOrPostcode", "country"],
                { shouldFocus: true },
              )

              // setError(!result)
              console.log({ errors })
              console.log({ result })
              if (result) {
                setScreen("confirm-payment")
              }
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

function PostcodeField({ setValue, errors }: { setValue: UseFormSetValue<FieldValues>; errors: FieldErrors<FieldValues> }) {
  return (
    <div>
      <label htmlFor="postal-code" className="block text-sm font-medium text-gray-11">
        Zip/Postal code
      </label>
      <div className="mt-1">
        <input
          type="text"
          name="postal-code"
          id="postal-code"
          autoComplete="postal-code"
          className={cn(
            "block w-full rounded-md border-slate-7 shadow-sm sm:text-sm",
            !errors.ZipOrPostcode?.message
              ? "focus:border-indigo-500 focus:ring-indigo-500"
              : "border-red-300 text-red-900 placeholder:text-red-300 focus:border-red-500 focus:ring-0",
          )}
          onChange={(e) => {
            setValue("ZipOrPostcode", e.target.value, { shouldValidate: true })
          }}
        />
      </div>
    </div>
  )
}

function CountryField({ options }: { options: Record<string, string> }) {
  return (
    <div>
      <label htmlFor="country" className="block text-sm font-medium text-gray-11">
        Country
      </label>
      <div className="mt-1">
        <DropdownOptionsFormControl name="country" options={options} defaultValue={"US"} />
      </div>
    </div>
  )
}
