"use client";

import React from "react";
import { CurrencyType } from "@acme/db";
import type { Environment } from "@acme/db";
import { cn } from "@acme/shadcn/utils/cn";
import { useFormContext } from "react-hook-form";



import type { CurrenciesType } from "~/_backend/currencies"


export default function AmountAndCurrencyInput({
  environment,
  amountField,

  defaultAmount,
  defaultCurrencyId,
  currenciesIncludingFiat,
}: {
  environment: Environment
  amountField: string
  defaultAmount?: number
  defaultCurrencyId?: string
  currenciesIncludingFiat: CurrenciesType
}) {
  const form = useFormContext()
  const amountFieldOptions = {
    min: 0,
    setValueAs: (v: string) => (v === "" ? undefined : v),
  }
  if (!form.watch("currencyId")) form.setValue("currencyId", defaultCurrencyId)
  const selectedCurrency = currenciesIncludingFiat.find((c) => c.id === form.watch("currencyId"))
  return (
    <div
      className={cn(
        "flex  w-fit flex-row",
        "relative mt-2 flex-1 rounded-md shadow-sm ring-1 ring-inset ring-slate-7 focus:ring-2 focus:ring-inset focus:ring-indigo-600",
      )}
    >
      <div className="pointer-events-none ml-3 flex w-[64px] flex-row items-center justify-end text-right">
        <span className=" text-slate-10 sm:text-sm ">
          {environment?.network === "testnet" ? "t" : ""}
          {selectedCurrency?.symbol || selectedCurrency?.ticker}
        </span>
      </div>
      <input
        defaultValue={defaultAmount}
        type="number"
        className="block w-32 rounded-md border-0 bg-transparent py-1.5 text-slate-12 shadow-none  placeholder:text-gray-400  sm:text-sm sm:leading-6"
        {...form.register(amountField, amountFieldOptions)}
        step="any"
      />
      <div className="flex items-center">
        <label htmlFor="currency" className="sr-only">
          Currency
        </label>
        <select
          id="currency"
          defaultValue={defaultCurrencyId}
          className="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-slate-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
          {...form.register("currencyId", { required: true })}
        >
          <optgroup label="Fiat">
            {currenciesIncludingFiat
              .filter((currency) => currency.type === CurrencyType.FIAT)
              .map((currency) => (
                <option key={currency.id} value={currency.id}>
                  {currency.ticker}
                </option>
              ))}
          </optgroup>
          <optgroup label="Cardano">
            {currenciesIncludingFiat
              .filter((currency) => currency.type === CurrencyType.CRYPTO)
              .map((currency) => (
                <option key={currency.id} value={currency.id}>
                  {currency.ticker}
                </option>
              ))}
          </optgroup>
        </select>
      </div>
    </div>
  )
}