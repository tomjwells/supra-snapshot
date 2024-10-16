import { and, asc, eq } from "@acme/db-drizzle"
import { db } from "@acme/db-drizzle/client"
import { Currencies, CurrencyType } from "@acme/db-drizzle/schema"
import { Box, Code, Container, Section, Text } from "@radix-ui/themes"

import FAQAccordion from "./FAQAccordion"

export default async function FAQ() {
  const currencies = await db
    .select()
    .from(Currencies)
    .where(and(eq(Currencies.enabled, true), eq(Currencies.type, CurrencyType.enumValues[1])))
    .orderBy(asc(Currencies.orderIndex))
    .execute()
  const FAQs = [
    {
      question: "Is Supra available in my country?",
      answer: <>Yes. Supra is currently available in all countries, and is suitable for international payments.</>,
    },

    {
      question: "How do I receive payments?",
      answer: (
        <>
          Funds are sent to the merchant directly as part of the transaction initiated by the customer. This is set up simply by adding your Cardano wallet
          address in our dashboard.
          <br />
          <br />
          The funds arrive in your wallet as soon as the Cardano blockchain has finished processing the transaction, this usually takes from 1-2 minutes after
          the transaction was submitted (depending on the conditions of the blockchain).
          <br />
          <br />
          Supra also has the ability to set up email notifications, so you can get notified when you receive a payment.
        </>
      ),
    },
    {
      question: "Can my product's prices be set in a stable currency?",
      answer: (
        <>
          Yes. Prices can be set directly in fiat currencies such as <Code>USD</Code>, or in terms of well-known Cardano stablecoins, including{" "}
          <Code>DJED</Code> and <Code>iUSD</Code>.
        </>
      ),
    },

    {
      question: "How do I integrate Supra into my website?",
      answer:
        "Supra's checkout pages, can easily be integrated into almost any website. As long as you can add hyperlinks to your website, posts or marketing materials, your customers will be able to visit links where they can pay for your items. ",
    },
    {
      question: "Which tokens does Supra support?",
      answer: (
        <>
          Supra supports many tokens that are important to the Cardano ecosystem. Here&rsquo;s a complete list of the tokens we currently support:
          <br />
          <br />
          {currencies?.map((currency, i) => (
            <span key={currency.ticker}>
              {i === 0 ? " " : i === currencies.length - 1 ? " & " : ", "}
              <Code color="violet">{currency.ticker}</Code>
            </span>
          ))}
          .
          <br />
          <br />
          These tokens may be used for both setting the prices of your products, and accepting them as payments. If you need any more tokens supported, please
          contact us!
        </>
      ),
    },
    {
      question: "Can Supra track my inventory?",
      answer:
        "Yes. Supra allows you to specify the quantity of each item you have in stock and has the ability to track the remaining stock as customers make purchases - so you never sell more than you have available.",
    },
    {
      question: "Can I add Shipping to my products?",
      answer:
        "Supra supports shipping policies, with different prices for postage to different regions, which can then be assigned to your products. The total cost order of the order, including postage, is calculated using the customer's address at checkout.",
    },
  ]

  return (
    <Section id="faq" size={{ initial: "2", md: "3" }}>
      <Container
        size="3"
        px={{
          initial: "6",
          sm: "8",
          md: "6",
          lg: "4",
        }}
      >
        <div className="mx-auto text-center">
          <Box mb="5">
            <Code size="5" color="violet">
              FAQ
            </Code>
          </Box>
          <Text className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">Frequently Asked Questions</Text>
        </div>

        <div className="py-8">
          <span className="shadow-[0_2px_10px] shadow-black/5">
            <FAQAccordion FAQs={FAQs} />
          </span>
        </div>
      </Container>
    </Section>
  )
}
