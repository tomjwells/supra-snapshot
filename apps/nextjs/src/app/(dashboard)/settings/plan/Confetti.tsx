"use client"

// Needs to be a client component
import { OrganizationTier } from "@acme/db"
import Confetti from "react-dom-confetti"

export function ConfettiComponent({ tier }: { tier: OrganizationTier }) {
  return (
    <Confetti
      active={tier == OrganizationTier.PROFESSIONAL}
      config={{
        angle: 90,
        spread: 180,
        startVelocity: 45,
      }}
    />
  )
}
