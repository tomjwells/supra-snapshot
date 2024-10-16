import Link from "next/link"
import { Select, Text } from "@radix-ui/themes"

import GenericFormField from "./GenericFormField"

export default function SelectableField({
  title,
  subtitle,
  defaultValue,
  disabled = false,
  edit,
  onChange,
  options,
  href,
}: {
  title: string
  subtitle?: string
  defaultValue: string
  disabled?: boolean
  edit: boolean
  onChange: (e: string) => void
  options: { id: string; name: string }[]
  href?: string
}) {
  return (
    <GenericFormField title={title} subtitle={subtitle}>
      {edit ? (
        <Select.Root size="3" value={defaultValue} onValueChange={(value) => onChange(value)} disabled={disabled}>
          <Select.Trigger variant="surface" className="w-full text-slate-12" />
          <Select.Content position="popper" className="z-[9999]">
            {options.length > 0 && (
              <Select.Group>
                {options.map((option) => (
                  <Select.Item key={option.id} value={option.id}>
                    {option.name}
                  </Select.Item>
                ))}
              </Select.Group>
            )}
          </Select.Content>
        </Select.Root>
      ) : (
        <Link href={href}>
          <Text color="gray">{options.find((option) => option.id === defaultValue)?.name ?? "--"}</Text>
        </Link>
      )}
    </GenericFormField>
  )
}
