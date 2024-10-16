import React from "react"
import { Flex, Select } from "@radix-ui/themes"

import { data } from "./data"

export default function CurrencySelectorRadixThemes() {
  return (
    <Flex gap="3" align="center" width="100%">
      <Select.Root size="3" defaultValue={data[0].value} className="w-full">
        <Select.Trigger className="w-full" />
        <Select.Content>
          {data.map((item) => (
            <Select.Item value={item.value}>{item.label}</Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </Flex>
  )
}
