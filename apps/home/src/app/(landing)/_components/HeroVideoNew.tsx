"use client"

import { cn } from "@acme/shadcn/utils/cn"
import { videos } from "@data/constants"
import { Box, Tabs, Text } from "@radix-ui/themes"

export function HeroVideo() {
  return (
    <div className="relative mx-auto w-full max-w-6xl rounded-t-2xl   p-4">
      <Tabs.Root defaultValue="account">
        <Tabs.List size="2">
          <Tabs.Trigger value="PWD">Pay with DJED</Tabs.Trigger>
          <Tabs.Trigger value="PWA">Pay with ADA</Tabs.Trigger>
        </Tabs.List>

        <Box px="2" pt="2" pb="2">
          <Tabs.Content value="PWD">
            <VideoElement url={videos.pay_with_djed} />
          </Tabs.Content>

          <Tabs.Content value="PWA">
            <VideoElement url={videos.pay_with_ada} />
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </div>
  )
}

function VideoElement({ url }: { url: string }) {
  return (
    <>
      <div
        className={cn("absolute inset-0 -z-10 opacity-0", "animate-video-glow opacity-0 ")}
        style={{
          background:
            "conic-gradient(from 230.29deg at 51.63% 52.16%, rgb(36, 0, 255) 0deg, rgb(0, 135, 255) 67.5deg, rgb(10 32 145) 198.75deg, hsl(223.03deg 100% 57.2%) 251.25deg, rgb(54, 103, 196) 301.88deg, rgb(39 9 182) 360deg)",
          filter: "blur(160px)",
          transform: "translateZ(0px)",
        }}
      />
      <div
        className={cn(
          "overflow-hidden rounded-lg",
          "animate-video-fade-in opacity-0 [--animation-delay:200ms]",
        )}
      >
        <video playsInline muted={true} loop={true} controls={true} autoPlay={process.env.NODE_ENV === "production"}>
          <source src={url} type="video/mp4" />
          Sorry, your browser doesn't support embedded videos.
        </video>
      </div>
    </>
  )
}
