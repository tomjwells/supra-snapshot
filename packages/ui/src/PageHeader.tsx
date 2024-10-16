import { Flex, Heading } from "@radix-ui/themes"

export default function PageHeader({
  title,
  titleFallback,
  subtitle,
  RightComponent,
}: {
  title?: React.ReactNode
  titleFallback?: string
  subtitle?: string
  RightComponent?: React.ReactNode
}) {
  return (
    <Flex direction="column" gap="1">
      <Flex direction="row" justify="between" align="start">
        <div>
          {title ? (
            <Heading as="h1" size="7" style={{ fontWeight: 600 }} className="truncate text-2xl leading-7 text-slate-12 sm:text-3xl sm:tracking-tight">
              {title}
            </Heading>
          ) : (
            titleFallback && (
              <Heading as="h1" size="7" style={{ fontWeight: 600 }} className="truncate text-2xl leading-7 text-slate-8 sm:text-3xl sm:tracking-tight">
                {titleFallback}
              </Heading>
            )
          )}
        </div>

        <div>{RightComponent}</div>
      </Flex>
      <h2 className="text-gray-10">{subtitle}</h2>
    </Flex>
  )
}
