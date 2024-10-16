"use client"

import React from "react"
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@acme/shadcn/carousel"
import { Box, Code, Container, Grid, Heading, Section, Text } from "@radix-ui/themes"

import Panel from "./TomCard"

export default function DashboardSection() {
  const [current, setCurrent] = React.useState(0)

  return (
    <Section size={{ initial: "2", md: "3" }}>
      <Container
        size="4"
        px={{
          sm: "6",
          md: "2",
          lg: "0",
        }}
      >
        <Box px="3">
          <Grid
            gap={{
              initial: "6",
              md: "9",
            }}
            columns={{
              initial: "1",
              md: "2",
            }}
          >
            <Box>
              <Box mb="5">
                <Code mb="5" size="4" color="violet">
                  Dashboard
                </Code>
              </Box>
              <Heading as="h2" size="8" style={{ fontWeight: 500, lineHeight: "40px" }} mb="4">
                What is Supra?
              </Heading>
              <Text size="4" style={{ lineHeight: "27px" }}>
                Supra helps creators and sellers easily accept payments on Cardano. With Supra, you can set up products, create checkout links, and sell your
                items.
              </Text>
              <Box
                mt="5"
                mx={{
                  initial: "0",
                  md: "-3",
                }}
              >
                <Panel
                  onMouseEnter={() => {
                    setCurrent(0)
                  }}
                  variant={current === 0 ? "active" : "ghost"}
                >
                  <Text weight="medium" style={{ lineHeight: "22px", fontSize: "15px" }} mb="1">
                    Add Products
                  </Text>
                  <Text style={{ lineHeight: "22px", color: "var(--gray-subtitle)", fontSize: "15px" }} size="3">
                    Add product information, decide which customer information to collect, and even manage inventory if needed.
                  </Text>
                </Panel>
                <Panel
                  onMouseEnter={() => {
                    setCurrent(1)
                  }}
                  variant={current === 1 ? "active" : "ghost"}
                >
                  <Text weight="medium" style={{ lineHeight: "22px", fontSize: "15px" }} mb="1">
                    Create Checkout Pages
                  </Text>
                  <Text style={{ lineHeight: "22px", color: "var(--gray-subtitle)", fontSize: "15px" }} size="3">
                    User friendly and high-converting checkout pages, that make it easy for customers to purchase products with their favourite browser wallets.
                  </Text>
                </Panel>
                <Panel
                  onMouseEnter={() => {
                    setCurrent(2)
                  }}
                  variant={current === 2 ? "active" : "ghost"}
                >
                  <Text weight="medium" style={{ lineHeight: "22px", fontSize: "15px" }} mb="1">
                    Get Notified
                  </Text>
                  <Text style={{ lineHeight: "22px", color: "var(--gray-subtitle)", fontSize: "15px" }} size="3">
                    Receive real-time notifications about payment and purchases. Supra&apos;s notification system keeps you informed about every sale.
                  </Text>
                </Panel>
              </Box>
            </Box>
            <CarouselDemo current={current} />
          </Grid>
        </Box>
      </Container>
    </Section>
  )
}

export function CarouselDemo({ current }: { current: number }) {
  const [api, setApi] = React.useState<CarouselApi>()

  React.useEffect(() => {
    if (!api) {
      return
    }
    api.scrollTo(current)
  }, [api, current])

  return (
    <div className="flex h-full w-full items-center justify-center align-middle lg:w-[51vw] lg:flex-row lg:flex-col">
      <Carousel
        opts={{
          align: "start",
        }}
        orientation="vertical"
        className="w-full "
        setApi={setApi}
      >
        <CarouselContent className="h-[calc(27rem+1rem)]">
          <CarouselItem className="basis-1 pt-4">
            <CarouselImage src="/screenshots/dashboard/products.png" alt="product" />
          </CarouselItem>
          <CarouselItem className="basis-1">
            <CarouselVideo src="/landing/videos/checkout_demo.mp4#t=5" />
          </CarouselItem>
          <CarouselItem className="basis-1">
            <CarouselImage src="/screenshots/dashboard/notifications.png" alt="notifications" />
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  )
}

const CarouselImage = ({ src, alt }: { src: string; alt: string }) => (
  <div className="flex w-full flex-row justify-center lg:justify-normal">
    <img
      style={{
        objectPosition: "left",

        width: "auto",
        height: "auto",
        maxWidth: "50rem", 
        maxHeight: "27rem",
        objectFit: "contain",
        borderRadius: "0.75rem",
        left: "50%",
      }}
      src={src}
      alt={alt}
      sizes="100vh"
      placeholder="blur"
    />
  </div>
)

const CarouselVideo = ({ src }: { src: string }) => (
  <div className="flex w-full flex-row justify-center lg:justify-normal">
    <video
      playsInline
      muted={true}
      loop={true}
      controls={false}
      autoPlay={true}
      style={{
        objectPosition: "left",

        width: "auto",
        height: "auto",
        maxWidth: "50rem", 
        maxHeight: "27rem",
        objectFit: "contain",
        borderRadius: "0.75rem",
        left: "50%",
        marginBottom: "0.75rem",
      }}
    >
      <source src={src} type="video/mp4" />
      Sorry, your browser doesn't support embedded videos.
    </video>
  </div>
)
