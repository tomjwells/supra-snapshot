"use client"

import { useRef } from "react"
import { cn } from "@acme/shadcn/utils/cn"
import { videos } from "@data/constants"

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  function handleVideoLoad() {
    const videoGlow = document.querySelector("#video-bg")
    if (videoGlow) {
      videoGlow.classList.add("animate-video-glow")
    }
  }
  return (
    <div className="relative mx-auto w-full max-w-6xl rounded-t-2xl   p-2 pb-20">
      <div
        id="video-bg"
        className={cn("absolute inset-0 -z-10 opacity-0", "animate-video-glow")}
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
          "mx-auto -mt-px max-w-6xl rounded-md bg-white/[0.07] p-[0.65rem] dark:bg-white/5 md:rounded-none",
        )}
      >
        <video
          ref={videoRef}
          playsInline
          muted={true}
          loop={true}
          controls={true}
          autoPlay={process.env.NODE_ENV === "production"}
          onLoadedData={handleVideoLoad} 
        >
          <source src={`${videos.pay_with_djed}#t=5`} type="video/mp4" />
          Sorry, your browser doesn't support embedded videos.
        </video>
      </div>
    </div>
  )
}
