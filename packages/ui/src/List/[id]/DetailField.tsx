import React from "react"
import Link from "next/link"

export function DetailField({ label, value }: { label: string; value: string | React.ReactNode }) {
  return (
    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
      <dt className="py-1.5 text-sm font-medium text-slate-12">{label}</dt>
      <dd className="mt-1 text-sm leading-6 text-gray-11 sm:col-span-2 sm:mt-0">
        <div className="truncate py-1.5">{value}</div>
      </dd>
    </div>
  )
}

export function DetailElement({ label, element }: { label: string; element: React.ReactNode }) {
  return (
    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
      <dt className="py-1.5 text-sm font-medium text-slate-12">{label}</dt>
      <dd className="mt-1 text-sm leading-6 text-gray-11 sm:col-span-2 sm:mt-0">{element}</dd>
    </div>
  )
}

export function DetailLinkField({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <>
      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt className="py-1.5 text-sm font-medium text-slate-12">{label}</dt>
        <dd className="mt-1 text-sm leading-6 text-gray-11 sm:col-span-2 sm:mt-0">
          <div className="flex flex-row justify-between py-1.5">
            <Link className="max-w-xs truncate" target="_blank" href={href}>
              {value}
            </Link>
          </div>
        </dd>
      </div>
    </>
  )
}
