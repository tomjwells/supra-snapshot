"use client"

import * as React from "react"
import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@acme/shadcn/navigation-menu"
import { cn } from "@acme/shadcn/utils/cn"

// @ts-ignore cjs
import { env } from "~/env.ts"

const components: { title: string; href: string; description: React.ReactNode }[] = [
  {
    title: "Cardano T-shirt Collection",
    href: env.NEXT_PUBLIC_CHECKOUT_URL + "/6795b58d-f8b7-420c-ac1f-c2b1b6d008ad",
    description: <>A collection of t-shirts, featuring different colors and designs.</>,
  },
  {
    title: "Book with Custom Variants",
    href: env.NEXT_PUBLIC_CHECKOUT_URL + "/2d7cb40b-78c8-435e-b712-df54443b93c7",
    description: "A book with independent variants for hardcover, softcover, audiobook and ebook.",
  },
  {
    title: "Single Product (Coffee Mug)",
    href: env.NEXT_PUBLIC_CHECKOUT_URL + "/bd130a1e-c700-4ba8-a10b-5f0bf1203261",
    description: "A simple checkout page for a single coffee mug.",
  },
]

export function HeaderNavigationMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavMenuItem href="https://docs.suprapayments.io" target="_blank">
          Docs
        </NavMenuItem>
        <ExamplesMenu />
        <NavMenuItem href="/pricing">Pricing</NavMenuItem>
        <NavMenuItem href="/contact">Contact</NavMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const NavMenuItem: React.FC<{ href: string; target?: string; children: React.ReactNode }> = ({ href, target = undefined, children }) => {
  return (
    <NavigationMenuItem>
      <Link href={href} legacyBehavior passHref>
        <NavigationMenuLink className={navigationMenuTriggerStyle() + " text-base"} target={target}>
          {children}
        </NavigationMenuLink>
      </Link>
    </NavigationMenuItem>
  )
}
export { NavMenuItem }

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-2 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className={cn("text-sm font-medium leading-none", "text-gray-12 !opacity-[0.85] group-hover:!opacity-100 dark:group-hover:text-white")}>
            {title}
          </div>
          <p className={cn("line-clamp-2 text-sm leading-snug ", "text-muted-foreground !opacity-[0.80] group-hover:!opacity-100")}>{children}</p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

function ExamplesMenu() {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className="!text-gray-12">Examples</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid w-[200px] gap-3 p-3 md:w-[500px] md:grid-cols-1 lg:w-[300px] ">
          {components.map((component) => (
            <ListItem key={component.title} title={component.title} href={component.href} target="_blank">
              {component.description}
            </ListItem>
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  )
}
