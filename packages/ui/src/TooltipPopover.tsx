"use client"

import { InfoCircledIcon } from "@radix-ui/react-icons"
import { IconButton, Popover, Text } from "@radix-ui/themes"

export default function TooltipPopover({ text, size = 15 }: { text: React.ReactNode; size?: number }) {
  return (
    <Popover.Root>
      <Popover.Trigger>
        <IconButton variant="ghost">
          <InfoCircledIcon width={size} height={size} />
        </IconButton>
      </Popover.Trigger>
      <Popover.Content style={{ width: 360 }}>
        <Text size="2">{text}</Text>
      </Popover.Content>
    </Popover.Root>
  )
}
