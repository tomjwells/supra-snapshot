import { Network, PaymentStatus, prisma } from "@acme/db"
import { Container, Flex, Grid, Heading, Section, Text } from "@radix-ui/themes"

export default async function StatsAtAGlance() {
  const currencies = await prisma.currencies.findMany({
    select: {
      id: true,
      lastPrice: true,
    },
  })
  const paymentAmountsByCurrency = await prisma.payment.groupBy({
    by: ["totalAmountChargedCurrencyId"],
    _sum: {
      totalAmountCharged: true,
    },
    where: {
      network: Network.mainnet,
      status: PaymentStatus.COMPLETE,
    },
  })
  const totalRevenue = paymentAmountsByCurrency.reduce((acc, curr) => {
    if (!curr._sum.totalAmountCharged) return acc
    return (
      acc +
      curr._sum.totalAmountCharged.toNumber() * (currencies.find((c) => c.id === curr.totalAmountChargedCurrencyId) ?? { lastPrice: 0 }).lastPrice?.toNumber()
    )
  }, 0)

  return (
    <Section size={{ initial: "2", md: "3" }}>
      <Container size="4">
        <Heading as="h3" size="8" align="center" mb="7">
          Stats at a glance
        </Heading>
        <Grid
          columns={{
            initial: "2",
            md: "4",
          }}
        >
          <Flex direction="column">
            <Text color="gray" style={{ lineHeight: "20px" }} mb="3">
              Number of Users
            </Text>
            <Text size="8" style={{ fontWeight: 500 }}>
              {await prisma.user.count()}
            </Text>
          </Flex>
          <Flex direction="column">
            <Text color="gray" style={{ lineHeight: "20px" }} mb="3">
              Products Listed
            </Text>
            <Text size="8" style={{ fontWeight: 500 }}>
              {await prisma.product.count({
                where: {
                  Environment: {
                    network: Network.mainnet,
                  },
                },
              })}
            </Text>
          </Flex>
          <Flex direction="column">
            <Text color="gray" style={{ lineHeight: "20px" }} mb="3">
              Checkouts Completed
            </Text>
            <Text size="8" style={{ fontWeight: 500 }}>
              {await prisma.payment.count({
                where: {
                  network: Network.mainnet,
                  status: PaymentStatus.COMPLETE,
                },
              })}
            </Text>
          </Flex>
          <Flex direction="column">
            <Text color="gray" style={{ lineHeight: "20px" }} mb="3">
              ADA Transacted
            </Text>
            <Text size="8" style={{ fontWeight: 500 }}>
              ₳{totalRevenue.toFixed(0)}
            </Text>
          </Flex>
        </Grid>
      </Container>
    </Section>
  )
}
