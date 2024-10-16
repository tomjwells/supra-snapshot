import { Card, Flex, Text } from "@radix-ui/themes"

function MetricPanel({
  panelTitle,
  Icon,
  children,
}: {
  panelTitle: string
  Icon:
    | "CreditCard"
    | "Users"
    | "Signal"
    | "₳"
    | React.ForwardRefExoticComponent<
        Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
          title?: string | undefined
          titleId?: string | undefined
        } & React.RefAttributes<SVGSVGElement>
      >
  children: React.ReactNode
}) {
  return (
    <Card variant="classic">
      <Flex p="3" direction="column" height="100%" width="100%" justify="center">
        <Flex direction="row" justify="between" align="center" gap="2">
          <Text as="div" size="2" weight="medium">
            {panelTitle}
          </Text>
          {typeof Icon === "string" ? Icon : <Icon className="h-4 w-4 text-muted-foreground" />}

        </Flex>
        <div className="pt-2 text-2xl font-bold">{children}</div>
      </Flex>
    </Card>
  )
}

export default MetricPanel
