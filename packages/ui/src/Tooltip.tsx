import React from "react"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import * as RadixTooltip from "@radix-ui/react-tooltip"

export default function Tooltip({ text }: { text: string }) {
  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>
          <button
            className="cursor-pointer rounded text-blue-500 hover:bg-gray-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            disabled
          >
            <InformationCircleIcon className="h-5 w-5" />
          </button>
        </RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade cursor-pointer select-none rounded bg-white p-2 text-sm leading-none  text-slate-10 shadow-lg will-change-[transform,opacity] dark:bg-slate-1"
            sideOffset={5}
          >
            {text}
            <RadixTooltip.Arrow className="fill-white" />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  )
}
