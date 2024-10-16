"use client"

import { Fragment } from "react"
import { Popover, Transition } from "@headlessui/react"
import { ChevronDownIcon } from "@heroicons/react/20/solid"

const solutions = [
  {
    name: "Help center",
    description: "Get all of your questions answered in our forums of contact support",
    href: "#",
  },
  {
    name: "Guides",
    description: "Learn how to maximize our platform to get the most out of it",
    href: "https://docs.suprapayments.io",
  },
  {
    name: "Leave Feedback",
    description: "Help us help you! Tell us how we can improve our service.",
    href: "https://suprapayments.io/contact",
  },
]

export default function AccountMenu() {
  return (
    <Popover className="relative">
      <Popover.Button className="inline-flex items-center gap-x-1 rounded px-4 py-2 leading-6 text-slate-12 hover:bg-gray-2">
        <span>
          Account
        </span>
        <ChevronDownIcon className="h-5 w-5 text-slate-10" aria-hidden="true" />
      </Popover.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="absolute left-full z-10 mt-5 flex w-screen max-w-max -translate-x-full">
          <div className="w-screen max-w-sm flex-auto rounded-3xl bg-white p-3 text-sm leading-6 shadow-lg ring-1 ring-gray-900/5 dark:bg-slate-1">
            {solutions.map((item) => (
              <div key={item.name} className="relative rounded-lg p-4 hover:bg-gray-2">
                <a href={item.href} className="font-semibold text-slate-12">
                  {item.name}
                  <span className="absolute inset-0" />
                </a>
                <p className="mt-1 text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}
