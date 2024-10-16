import * as React from "react"
import { Body, Button, Container, Head, Heading, Hr, Html, Img, Link, Preview, Section, Text } from "@react-email/components"

export const MagicLinkEmail = ({ url, host: _host }: { url: string; host: string }) => (
  <Html>
    <Head />
    <Preview>Log in to Supra</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img src={"https://suprapayments.io/favicon.png"} width="42" height="42" alt="Supra" style={logo} />
        <Heading style={heading}>Log in to Supra</Heading>
        <Text style={paragraph}>You can securely log in to Supra by clicking the button below.</Text>
        <Section style={buttonContainer}>
          <Button style={button} href={url}>
            Login to Supra
          </Button>
        </Section>
        <Hr style={hr} />
        <Link href={url} style={reportLink}>
          Supra
        </Link>
      </Container>
    </Body>
  </Html>
)

const logo = {
  borderRadius: 21,
  width: 42,
  height: 42,
}

const main = {
  backgroundColor: "#ffffff",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "560px",
}

const heading = {
  fontSize: "24px",
  letterSpacing: "-0.5px",
  lineHeight: "1.3",
  fontWeight: "400",
  color: "#484848",
  padding: "17px 0 0",
}

const paragraph = {
  margin: "0 0 15px",
  fontSize: "15px",
  lineHeight: "1.4",
  color: "#3c4149",
}

const buttonContainer = {
  padding: "27px 0 27px",
}

const button = {
  backgroundColor: "#000000",
  borderRadius: "3px",
  fontWeight: "600",
  color: "#fff",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "11px 23px",
}

const reportLink = {
  fontSize: "14px",
  color: "#b4becc",
}

const hr = {
  borderColor: "#dfe1e4",
  margin: "42px 0 26px",
}
