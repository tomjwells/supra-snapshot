import CheckboxInput from "./CheckboxInput"
import GenericFormField from "./GenericFormField"

export default function CheckboxField({
  title,
  subtitle,
  registerName,
  defaultValue,
  disabled,
  label,
}: {
  title: string
  subtitle?: string
  registerName: string
  registerOptions?: Record<string, unknown>
  defaultValue?: boolean
  disabled?: boolean
  label?: string
}) {
  return (
    <GenericFormField title={title} subtitle={subtitle}>
      <CheckboxInput registerName={registerName} defaultValue={defaultValue} disabled={disabled} label={label} />
    </GenericFormField>
  )
}
