import Link from "next/link"
import { ArrowLeftIcon } from "@heroicons/react/20/solid"
import { Flex, Heading } from "@radix-ui/themes"

export default function BackArrow({ text, href }: { text: string; href: string }) {
  return (
    <Flex width="100%">
      <Link href={href}>
        <Flex direction="row" align="center" gap="3" className="text-gray-8" pr="6">
          <ArrowLeftIcon className="h-5 w-5 " aria-hidden="true" />
          <Heading weight="medium" size="3">
            {text}
          </Heading>
        </Flex>
      </Link>
    </Flex>
  )
}
