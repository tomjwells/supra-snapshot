import { Box, Code, Container, Grid, Heading, Section, Text } from "@radix-ui/themes"

const features = [
  {
    title: "Extremely Secure",
    description:
      "From implementing multi-sig transactions, to our decision not to store any funds on the platform, Supra is built from the ground up with security as our top-priority.",
  },
  {
    title: "No-code",
    description:
      "After security, ease-of-use is our next priority. Our carefully designed dashboard makes accepting payments on Cardano accessible to everyone.",
  },
  {
    title: "Multiple Token Support",
    description: (
      <>
        Buy and sell products and services in stable coins such as <Code color="violet">DJED</Code> and <Code color="violet">iUSD</Code>. Supra also supports
        payments in <Code color="violet">ADA</Code> and many other native tokens.
      </>
    ),
  },
  {
    title: "Instant settlement",
    description:
      "Funds are sent to the seller directly as part of the transaction created by the customer. No need to withdraw manually or wait for funds to appear in your wallet.",
  },
  {
    title: "Test & Live Environments",
    description: "Our test environments allow users to try Supra on Cardano's preproduction (Testnet) network before selling any products for real on Mainnet.",
  },
  {
    title: "Payments Analytics",
    description:
      "Compare the success of different products, or view your historical revenue growth over time. Keeping a record of payments over time allows you to better understand trends in your payments.",
  },
]

export default function FeaturesGrid() {
  return (
    <Section id="features" size={{ initial: "2", md: "3" }} className="relative">
      <Container
        size="2"
        px={{
          initial: "4",
          sm: "8",
          md: "6",
          lg: "0",
        }}
      >
        <Box px="3">
          <Heading as="h1" size="8" mb="3" align="center" weight="medium" style={{ fontSize: "35px", letterSpacing: "-1.19px" }}>
            Features
          </Heading>
          <Heading
            as="h2"
            size="5"
            mb="8"
            align="center"
            weight="regular"
            style={{ fontSize: "21px", letterSpacing: "-0.336px", color: "var(--gray-subtitle)" }}
          >
            A complete solution for Cardano payments
          </Heading>
          <Grid
            gap={{
              initial: "6",
              md: "8",
            }}
            columns={{
              initial: "1",
              md: "2",
            }}
          >
            {features.map((feature) => (
              <Box key={feature.title}>
                <Heading size="5" as="h4" mb="2" style={{ lineHeight: "19px", fontSize: "19px" }} weight="medium">
                  {feature.title}
                </Heading>
                <Text as="p" size="4" style={{ lineHeight: "27px", color: "var(--gray-subtitle)", fontSize: "17px" }}>
                  {feature.description}
                </Text>
              </Box>
            ))}
          </Grid>
        </Box>
      </Container>
    </Section>
  )
}
