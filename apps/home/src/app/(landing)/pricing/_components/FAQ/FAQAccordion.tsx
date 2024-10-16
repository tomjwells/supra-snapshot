"use client"

import React from "react"
import { cn } from "@acme/shadcn/utils/cn"
import * as Accordion from "@radix-ui/react-accordion"
import { ChevronDownIcon } from "@radix-ui/react-icons"

export default function FAQAccordion({ FAQs }: { FAQs: { question: string; answer: React.ReactNode }[] }) {
  return (
    <Accordion.Root
      className="w-full rounded-md bg-transparent"
      type="single"
      // defaultValue="item-1"
      collapsible
    >
      {FAQs.map((FAQ, index) => (
        <AccordionItem value={`item-${index}`} key={FAQ.question}>
          <AccordionTrigger>{FAQ.question}</AccordionTrigger>
          <AccordionContent>{FAQ.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion.Root>
  )
}

interface AccordionItemProps {
  children: React.ReactNode
  value: string
  className?: string
  // Additional props here
}
interface AccordionTriggerProps {
  children: React.ReactNode
  className?: string
  // Additional props here
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(({ children, className, value, ...props }, forwardedRef) => (
  <Accordion.Item
    className={cn(
      "mt-px overflow-hidden text-white first:mt-0 first:rounded-t last:rounded-b",
      "focus-within:relative focus-within:z-10",
      className,
      // focus-within:shadow-[0_0_0_2px]
    )}
    value={value}
    {...props}
    ref={forwardedRef}
  >
    {children}
  </Accordion.Item>
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(({ children, className, ...props }, forwardedRef) => (
  <Accordion.Header className="flex">
    <Accordion.Trigger
      className={cn(
        "hs-accordion-toggle group inline-flex w-full items-center justify-between gap-x-3 pb-3 text-left font-semibold text-black/50 transition hover:text-gray-400 dark:text-white/70 dark:hover:text-gray-400 md:text-lg",
        className,
      )}
      {...props}
      ref={forwardedRef}
    >
      {children}
      <ChevronDownIcon
        className="h-5 w-5 text-violet-10 transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:rotate-180"
        aria-hidden
      />
    </Accordion.Trigger>
  </Accordion.Header>
))
AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionTriggerProps>(({ children, className, ...props }, forwardedRef) => (
  <Accordion.Content
    className={cn("overflow-hidden  text-[17px] data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown", className)}
    {...props}
    ref={forwardedRef}
    style={{
      color: "var(--gray-subtitle)",
    }}
  >
    <div className="px-6 py-[15px]">{children}</div>
  </Accordion.Content>
))
AccordionContent.displayName = "AccordionContent"
