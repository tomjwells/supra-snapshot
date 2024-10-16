import { Box, Flex, Text } from "@radix-ui/themes"

export default function GenericFormField({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <Flex gap="5">
      <Box width="100%">
        <Text size="2" weight="medium" mb="1" as="label">
          {title}
        </Text>
        <Text as="div" color="gray" size="1">
          {subtitle}
        </Text>
      </Box>

      <Box width="100%">{children}</Box>
    </Flex>
  )
}
