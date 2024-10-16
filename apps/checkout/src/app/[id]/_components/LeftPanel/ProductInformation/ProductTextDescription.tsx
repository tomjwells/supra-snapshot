"use client"

import React, { Suspense } from "react"
import { Button, Dialog, Flex, Heading, Text } from "@radix-ui/themes"

import type { ProductType } from "~/_backend/products"

export default function ProductTextDescription({ product }: { product: NonNullable<ProductType> }) {
  const textRef = React.useRef(null)
  const [isOverflowing, setIsOverflowing] = React.useState(false)

  React.useEffect(() => {
    const element = textRef.current
    if (element && element.scrollHeight > element.clientHeight) {
      setIsOverflowing(true)
    }
  }, [textRef])
  return (
    <>
      <Text
        ref={textRef}
        size={{ initial: "1", sm: "2", md: "3" }}
        className="line-clamp-[6] hyphens-auto whitespace-pre-line break-words font-[500] tracking-tight text-white"
      >
        {product.description}
      </Text>
      {isOverflowing && (
        <Flex justify="end" mt="5">
          <DescriptionDialog product={product} />
        </Flex>
      )}
    </>
  )
}

function DescriptionDialog({ product }: { product: NonNullable<ProductType> }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <button
          type="button"
          className="rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Read more
        </button>
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 600 }}>
        <Dialog.Title>Description</Dialog.Title>

        <Text size={{ initial: "2", sm: "2", md: "3" }} className="hyphens-auto whitespace-pre-line break-words font-[500] tracking-tight text-black">
          <Suspense>{product.description}</Suspense>
        </Text>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Close
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  )
}
