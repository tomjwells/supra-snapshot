import { Heading } from "@radix-ui/themes"

export default function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <Heading as="h2" size={{ initial: "1", sm: "2" }} mb="1" weight="regular" style={{ color: "rgb(165, 180, 252)" }}>
      {children}
    </Heading>
  )
}
