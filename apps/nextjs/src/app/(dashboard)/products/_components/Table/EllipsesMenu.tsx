"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { DeleteModal } from "@acme/ui"
import { EllipsesMenuTrigger } from "@acme/ui/Menu"
import { Dialog, DropdownMenu } from "@radix-ui/themes"

import { listByProductIdPaymentsAction } from "~/_actions/payments"
import { deleteProductAction, duplicateProductAction } from "~/_actions/products"
import type { PaymentsType } from "~/_backend/payments"

export function EllipsesMenu({
  productId,
  redirectOnDuplicate = false,
  showDuplicate = true,
}: {
  productId: string
  redirectOnDuplicate?: boolean
  showDuplicate?: boolean
}) {
  const router = useRouter()
  const duplicateProductActionWithId = duplicateProductAction.bind(null, { productId })

  return (
    <Dialog.Root>
      <DropdownMenu.Root modal={false}>
        <DropdownMenu.Trigger>
          <EllipsesMenuTrigger />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          {showDuplicate && (
            <DropdownMenu.Item
            >
              <form
                action={async () => {
                  const duplicatedProduct = await duplicateProductActionWithId()
                  redirectOnDuplicate && router.push(`/products/${duplicatedProduct.id}`)
                }}
              >
                <button className="w-full text-left">Duplicate</button>
              </form>
            </DropdownMenu.Item>
          )}
          <DeleteItem productId={productId} />
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Dialog.Root>
  )
}

export function DeleteItem({ productId }: { productId: string }) {
  const [open, setOpen] = React.useState(false)
  const [payments, setPayments] = React.useState<PaymentsType | null>(null)
  const deleteProductActionWithId = deleteProductAction.bind(null, { productId })

  React.useEffect(() => {
    listByProductIdPaymentsAction(productId)
      .then((data) => {
        setPayments(data)
      })
      .catch((error) => {
        console.log("listByProductIdPaymentsAction error", error)
      })
  }, [productId])

  return payments && payments.length === 0 ? (
    <>
      <Dialog.Trigger>
        <DropdownMenu.Item
          color="red"
          onClick={(e) => {
            setOpen(true)
            e.preventDefault()
          }}
        >
          Delete
        </DropdownMenu.Item>
      </Dialog.Trigger>
      <DeleteModal open={open} setOpen={setOpen} deleteAction={deleteProductActionWithId} modelName="Product" />
    </>
  ) : null
}
