"use client"

// Error components must be Client Components
import { useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button, Flex, Heading } from "@radix-ui/themes"

export default function Error({ projectUrl, error, reset }: { projectUrl: string; error: Error & { digest?: string }; reset: () => void }) {
  const pathname = usePathname()


  return (
    <FullHeightWrapper>
      <Flex direction="column" gap="6" align="center">
        <Flex direction="column" gap="3" align="center">
          <Heading>Something&apos;s not right.</Heading>
          <h2 className="text-gray-10">The team has been notified of the problem and we'll fix the problem shortly.</h2>
          <h2 className="text-gray-10">Thanks for your patience.</h2>
        </Flex>
        <h2 className="text-gray-10">For now, you can try either of the following:</h2>
        <Flex direction="row" gap="3" align="center" justify="center">
          <Button
            variant="outline"
            onClick={
              () => reset()
            }
          >
            Try again
          </Button>
          <Button>
            <Link href="/">Go Home</Link>
          </Button>
        </Flex>
      </Flex>
    </FullHeightWrapper>
  )
}

function FullHeightWrapper({ children }: { children: React.ReactNode }) {
  return <span className="relative flex h-full items-center justify-center align-middle">{children}</span>
}
