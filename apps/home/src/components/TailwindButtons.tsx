"use client"

import React from "react"
import Link from "next/link"
import { cn } from "@acme/shadcn/utils/cn"
import { ArrowRightIcon, ExternalLinkIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"

type TailwindButtonProps = React.HTMLAttributes<HTMLButtonElement> & {
  text: string
  href: string
  icon?: "ArrowRightIcon" | "ArrowLeftIcon" | "ExternalLinkIcon" | "PlusIcon" | "CheckIcon" | "ChevronRightIcon" | "ChevronLeftIcon"
  withShadow?: boolean
  target?: string
}

export function Icon({ icon }: { icon: string | undefined }) {
  if (!icon) return null
  return (
    <>
      {icon === "ArrowRightIcon" && <ArrowRightIcon className="ml-2 h-5 w-6" />}
      {icon === "ExternalLinkIcon" && <ExternalLinkIcon className="ml-2 h-4 w-4" />}
    </>
  )
}

export function TailwindButton({ href, text, icon }: TailwindButtonProps) {
  return (
    <div className="group relative inline-flex">
      <div className="transitiona-all animate-tilt group-hover:duration-400 absolute -inset-px rounded-lg bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] opacity-50  blur-md filter duration-1000 group-hover:-inset-1 group-hover:opacity-70"></div>
      <Link
        href={href}
        className="font-pj relative inline-flex items-center justify-center rounded-lg bg-black px-4 py-2 font-bold text-white no-underline transition-all duration-200 hover:no-underline focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
        role="button"
      >
        <>
          {text}
          <Icon icon={icon} />
        </>
      </Link>
    </div>
  )
}

export function WhiteButton({ href, text, icon, withShadow, className, target = "" }: TailwindButtonProps) {
  const { theme } = useTheme()
  if (theme === "light") return <WhiteButtonCrazyShadow href={href} text={text} icon={icon} withShadow={withShadow} />

  return (
    <Link
      href={href}
      className={cn(
        "font-pj relative inline-flex items-center justify-center rounded-full bg-white  px-5 py-2 text-lg font-bold text-black no-underline transition-all duration-200 hover:no-underline focus:outline-none  focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 dark:bg-white dark:text-black",
        withShadow
          ? "group group relative flex w-fit justify-center rounded-full bg-white   text-black shadow-md shadow-zinc-950 dark:bg-white dark:shadow-xl md:w-fit"
          : "",
        className,
      )}
      role="button"
      target={target}
    >
      {text}
      <Icon icon={icon} />
    </Link>
  )
}
export function BlackButton({ href, text, icon, withShadow, className, target = "" }: TailwindButtonProps) {
  const { theme } = useTheme()
  if (theme === "light") return <WhiteButtonCrazyShadow href={href} text={text} icon={icon} withShadow={withShadow} />

  return (
    <Link
      href={href}
      className={cn(
        "font-pj relative inline-flex items-center justify-center rounded-full  px-5 py-2 text-lg font-bold text-white no-underline transition-all duration-200 hover:no-underline focus:outline-none  focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 dark:text-white",
        withShadow
          ? "group group relative flex w-fit justify-center rounded-full bg-black   text-white shadow-md shadow-zinc-950 dark:bg-black dark:shadow-xl hover:dark:bg-slate-1 md:w-fit"
          : "",
        className,
      )}
      role="button"
      target={target}
      style={{
        boxShadow: "0 0 0 1px hsla(0,0%,100%,.145),0px 1px 2px rgba(0,0,0,.16)",
      }}
    >
      {text}
      <Icon icon={icon} />
    </Link>
  )
}
export function WhiteButtonCrazyShadow({ href, text, icon, withShadow }: TailwindButtonProps) {
  return (
    <button
      className={cn(
        withShadow
          ? "group group relative flex w-fit justify-center rounded-lg bg-black p-px text-white shadow-[-1px_9px_14px_rgba(126,12,245,0.4),9px_-1px_14px_rgba(255,115,21,0.4),-8px_-7px_14px_rgba(254,52,110,0.4)] dark:bg-white md:w-fit"
          : "",
      )}
    >
      <Link
        href={href}
        className="font-pj relative inline-flex items-center justify-center rounded-lg  bg-black px-4 py-3 font-bold text-white no-underline transition-all duration-200 hover:no-underline focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 dark:bg-white dark:text-black"
        role="button"
      >
        <>
          {text}
          <Icon icon={icon} />
        </>
      </Link>
    </button>
  )
}

export function experimentalColoredShadowButton({ href, text, icon }: TailwindButtonProps) {
  return (
    <a
      href="/admin"
      className="inline-flex rounded-lg border border-transparent px-4 py-2 text-sm shadow-[-1px_9px_14px_rgba(126,12,245,0.1),9px_-1px_14px_rgba(255,115,21,0.1),-8px_-7px_14px_rgba(254,52,110,0.1)] hover:text-blue-500 md:max-lg:mr-1"
    >
      Get started
    </a>
  )
}

export function CursorStyleButton({ href, text, icon }: TailwindButtonProps) {
  return (
    <button className="group group relative flex w-fit justify-center rounded-full p-px text-[0.8125rem] font-semibold leading-6 text-white shadow-xl shadow-zinc-950 md:w-fit">
      <Link
        href={href}
        className="relative z-10 flex w-full items-center justify-center space-x-2 rounded-lg bg-[#3887FD] bg-opacity-50 px-6 py-3 no-underline ring-1 transition hover:bg-opacity-60"
        role="button"
      >
        <>
          {text}
          <Icon icon={icon} />
        </>
      </Link>
    </button>
  )
}

export function ColorGradientButton({ href, text }: TailwindButtonProps) {
  const colorClasses = "bg-gradient-to-br from-cyan10 to-indigo-11 hover:bg-gradient-to-br  hover:from-cyan8 hover:to-indigo-10 "
  return (
    <Link href={href} className="no-underline">
      <button className={cn("rounded px-4 py-2 text-gray-100 ", colorClasses)}>{text}</button>
    </Link>
  )
}

export function CursorStyleDownloadButton({ href, text }: TailwindButtonProps) {
  return (
    <button className="group relative rounded-full p-px text-[0.8125rem] font-semibold leading-6 text-white shadow-xl shadow-zinc-500 dark:shadow-zinc-950">
      <Link href={href} className="no-underline">
        <span className="absolute inset-0 overflow-hidden rounded-full">
          <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
        </span>
        <div className="relative z-10 flex items-center space-x-2 rounded-full bg-gradient-to-b from-zinc-800 to-zinc-900 px-4 py-1 ring-1 ring-black dark:ring-white/10">
          <span>{text}</span>
        </div>
        <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] transition-opacity duration-500 group-hover:opacity-40 dark:bg-gradient-to-r dark:from-emerald-400/0 dark:via-emerald-400/90 dark:to-emerald-400/0"></span>
      </Link>
    </button>
  )
}
export function CursorStyleDownloadButton2({ href, text }: TailwindButtonProps) {
  return (
    <button className="group relative rounded-full p-px text-[0.8125rem] font-semibold leading-6 text-white shadow-xl shadow-zinc-500 dark:shadow-zinc-950">
      <Link href={href} className="no-underline">
        <div className="relative z-10 flex items-center space-x-2 rounded-full bg-gradient-to-b from-zinc-800 to-zinc-900 px-4 py-1 ring-1 ring-black dark:ring-white/10">
          <span>{text}</span>
        </div>
        <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] transition-opacity duration-500 group-hover:opacity-40 "></span>
      </Link>
    </button>
  )
}
export function CursorStyleDownloadButton3({ href, text, className }: TailwindButtonProps & { className: string }) {
  return (
    <button
      className={cn(
        "group relative rounded-full p-px text-[0.8125rem] font-semibold leading-6 text-white shadow-xl shadow-zinc-500 dark:shadow-zinc-950",
        className,
      )}
      style={{
        boxShadow:
          "rgba(134, 143, 151, 0.2) 0px 0px 0px 0.5px inset, rgba(134, 143, 151, 0.4) 1px 1px 0px -0.5px inset, rgba(134, 143, 151, 0.4) -1px -1px 0px -0.5px inset",
      }}
    >
      <Link href={href} className="no-underline">
        <div
          className=" relative z-10 flex items-center space-x-2 rounded-full bg-gradient-to-b from-zinc-800 to-zinc-900 px-4 py-1 "
          style={{ textWrap: "nowrap" }}
        >
          {text}
        </div>
        <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] transition-opacity duration-500 group-hover:opacity-40 dark:bg-gradient-to-r dark:from-emerald-400/0 dark:via-emerald-400/90 dark:to-emerald-400/0"></span>
      </Link>
    </button>
  )
}
export function AceternityButton({ href, text, className }: TailwindButtonProps & { className: string }) {
  return (
    <button className="group relative inline-block cursor-pointer rounded-full bg-slate-800 p-px text-xs font-semibold leading-6 text-white no-underline  shadow-2xl shadow-zinc-900">
      <span className="absolute inset-0 overflow-hidden rounded-full">
        <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </span>
      <Link href={href} className="no-underline">
        <div
          className="relative z-10 flex items-center space-x-2 rounded-full bg-zinc-950 px-4 py-1 text-[0.8125rem] font-semibold ring-1 ring-white/10 "
          style={{ textWrap: "nowrap" }}
        >
          <span>Get Started</span>
          <svg fill="none" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.75 8.75L14.25 12L10.75 15.25" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </div>
      </Link>
      <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
    </button>
  )
}
