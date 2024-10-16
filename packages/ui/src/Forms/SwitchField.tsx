import { Switch } from "@radix-ui/themes"

import GenericFormField from "./GenericFormField"

export default function SwitchField({
  title,
  subtitle,
  checked,
  onCheckedChange,
  disabled = false,
}: {
  title: string
  subtitle?: string
  checked: boolean
  onCheckedChange: (e: boolean) => void
  disabled?: boolean
}) {
  return (
    <GenericFormField title={title} subtitle={subtitle}>
      <Switch size="3" variant="classic" tabIndex={-1} mt="2" checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
    </GenericFormField>
  )
}
