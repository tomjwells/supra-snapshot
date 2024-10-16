import GenericFormField from "./GenericFormField"
import Input from "./Input"

export default function InputField({
  title,
  subtitle,
  registerName,
  registerOptions,
  defaultValue,
  type,
  className = "",
  rows,
  placeholder,
  showErrors = false,
  customErrorMessage,
}: {
  title: string
  subtitle?: string
  registerName: string
  registerOptions?: Record<string, unknown>
  defaultValue?: string | number
  type?: string
  className?: string
  rows?: number
  placeholder?: string
  showErrors?: boolean
  customErrorMessage?: string
}) {
  return (
    <GenericFormField title={title} subtitle={subtitle}>
      <Input
        className={className}
        placeholder={placeholder}
        type={type}
        defaultValue={defaultValue}
        showErrors={showErrors}
        customErrorMessage={customErrorMessage}
        registerName={registerName}
        registerOptions={registerOptions}
      />
    </GenericFormField>
  )
}
