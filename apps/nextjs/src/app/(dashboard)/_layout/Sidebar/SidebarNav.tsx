"use client"

import { cn } from "@acme/shadcn"
import { BellIcon, ChatBubbleLeftIcon, CreditCardIcon, CubeIcon, HomeIcon, ShoppingCartIcon } from "@heroicons/react/24/outline"
import { Flex } from "@radix-ui/themes"
import { FiLayers } from "react-icons/fi"
import { PiGearDuotone } from "react-icons/pi"

import NavLink from "./NavLink"

export default function SidebarNav() {
  const iconSizes = "h-[1.17rem] w-[1.17rem]"
  const menu1 = [
    {
      title: "Dashboard",
      href: "/",
      icon: <HomeIcon className={cn(iconSizes, "shrink-0")} aria-hidden="true" />,
    },

    {
      title: "Products",
      href: "/products",
      icon: <CubeIcon className={cn(iconSizes, "shrink-0")} aria-hidden="true" />,
    },

    {
      title: "Collections",
      href: "/collections",
      icon: <FiLayers className={cn(iconSizes, "shrink-0")} aria-hidden="true" />,
    },
    {
      title: "Shipping",
      href: "/shipping-policies",
      icon: <ShoppingCartIcon className={cn(iconSizes, "shrink-0")} aria-hidden="true" />,
    },
    {
      title: "Payments",
      href: "/payments",
      icon: <CreditCardIcon className={cn(iconSizes, "shrink-0")} aria-hidden="true" />,
    },
    {
      title: "Notifications",
      href: "/notification-sources",
      icon: <BellIcon className={cn(iconSizes, "shrink-0")} aria-hidden="true" />,
    },
  ]

  const menu2 = [
    {
      title: "Feedback",
      href: "https://discord.gg/QpdNt9p7yJ",
      icon: <ChatBubbleLeftIcon className={cn(iconSizes, "shrink-0")} aria-hidden="true" />,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: <PiGearDuotone className={cn(iconSizes, "shrink-0")} aria-hidden="true" />,
    },
  ]

  return (
    <Flex direction="column" flexGrow="1">
      <Flex direction="column" flexGrow="1" gap="1">
        {menu1.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </Flex>
      <Flex direction="column" flexGrow="1" gap="1">
        {menu2.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </Flex>
    </Flex>
  )
}
