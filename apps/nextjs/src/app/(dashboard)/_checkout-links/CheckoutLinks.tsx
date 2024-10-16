"use client"

import React, { Fragment, useState } from "react"
import Link from "next/link"
import { Network } from "@acme/db"
import { cn } from "@acme/shadcn/utils/cn"
import DetailPanel from "@acme/ui/List/[id]/DetailPanel"
import { EllipsesMenuTrigger } from "@acme/ui/Menu"
import StatusBadge from "@acme/ui/StatusBadge"
import EmptyRow from "@acme/ui/Table/EmptyRow"
import TooltipPopover from "@acme/ui/TooltipPopover"
import { ArrowTopRightOnSquareIcon, LinkIcon } from "@heroicons/react/20/solid"
import { DocumentDuplicateIcon, QrCodeIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { PencilIcon } from "@heroicons/react/24/solid"
import type { CheckoutLink } from "@prisma/client"
import { CheckoutLinkStatus } from "@prisma/client"
import { Button, Checkbox, DropdownMenu, Flex, HoverCard, Table, Text } from "@radix-ui/themes"
import { LiaSaveSolid } from "react-icons/lia"
import { toast } from "sonner"

import { createCheckoutLinkAction, editCheckoutLinkAction } from "~/_actions/checkoutLinks"
import type { CheckoutLinks } from "~/_backend/checkoutLinks"
import type { EnvironmentType } from "~/_backend/environments"
import type { OrganizationType } from "~/_backend/organizations"
// @ts-ignore cjs
import { env } from "~/env.ts"

export default function CheckoutLinks({
  environment,
  checkoutLinks,
  organization,
  productId,
  collectionId,
}: {
  environment: EnvironmentType
  checkoutLinks: CheckoutLinks
  organization: OrganizationType
  collectionId?: string
  productId?: string
}) {
  const withdrawalAddress = environment.network === Network.testnet ? organization.testnetWithdrawalAddress : organization.mainnetWithdrawalAddress

  return (
    <DetailPanel title="Checkout Links" subtitle="Links where customers can purchase this product." fullWidth>
      <Table.Root className="w-full">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Template</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              <Flex direction="row">
                Redirect
                <TooltipPopover
                  text={
                    <>
                      Use the redirect option to redirect the customer to another webpage after completing their payment. This could be used to send the
                      customer to a thank you page or a download link.
                      <br />
                      <br />
                      The redirect will only be performed if the checkbox is checked.
                    </>
                  }
                />
              </Flex>
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Link</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {!withdrawalAddress && (
            <>
              <EmptyRow
                text={
                  <>
                    ℹ️{" "}
                    <Link href="/settings" className="underline">
                      Set a Cardano wallet address
                    </Link>{" "}
                    to enable checkout links.
                  </>
                }
              />
            </>
          )}
          {withdrawalAddress && checkoutLinks.map((checkoutLink, index) => <CheckoutLinkRow key={checkoutLink.id} checkoutLink={checkoutLink} index={index} />)}
          <CreateCheckoutLink productId={productId} collectionId={collectionId} />
        </Table.Body>
      </Table.Root>
    </DetailPanel>
  )
}

export function CheckoutLinkRow({ checkoutLink, index }: { checkoutLink: CheckoutLink; index: number }) {
  const url = `${env.NEXT_PUBLIC_CHECKOUT_URL}/${checkoutLink.id}`
  return (
    <Table.Row align="center">
      <td className="px-4 py-6 sm:px-6">
        <span className="text-sm font-medium text-slate-12">{`Link ${index + 1}`}</span>
      </td>
      <td className="px-4 py-6">
        <span className="mt-1 text-sm leading-6 text-theme-secondary sm:col-span-2 sm:mt-0">{"Default template"}</span>
      </td>
      <td className="px-4 py-6">
        <span className="flex flex-row items-center align-middle">
          <RedirectURL checkoutLink={checkoutLink} />
        </span>
      </td>
      <td className="px-4 py-6">
        <StatusBadge status={"neutral"} text={checkoutLink.status} />
      </td>
      <td className="px-4 py-6">
        <CopyURL url={url} />
      </td>
      <td className="w-full px-4 py-6 sm:gap-4 sm:px-6" colSpan={9999}>
        <div className="flex w-full flex-row justify-end gap-x-8">
          <QRCode url={url} />
          <Link href={url} target="_blank">
            <ArrowTopRightOnSquareIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
          </Link>
          <EllipsesMenu checkoutLinkId={checkoutLink.id} />
        </div>
      </td>
    </Table.Row>
  )
}

function prependProtocol(url: string): string {
  const protocolRegex = /^(https?|ftp):\/\//i

  if (!protocolRegex.test(url)) {
    return `https://${url}`
  }

  return url
}

export function RedirectURL({ checkoutLink }: { checkoutLink: CheckoutLink }) {
  const [edit, setEdit] = React.useState(false)

  const [redirectUrl, setRedirectUrl] = React.useState(checkoutLink?.redirectUrl || "")
  const [redirect, setRedirect] = React.useState(checkoutLink?.redirect || false)

  const error = false

  return (
    <>
      <Checkbox checked={redirect} onCheckedChange={(e) => setRedirect(e === true)} mr="3" contentEditable={edit} disabled={!edit} />
      <span className="flex w-full flex-row items-center justify-center justify-between align-middle">
        {edit ? (
          <span className="flex flex-col">
            <span className="flex flex-row">
              <div className="flex w-full rounded-md shadow-sm">
                <div className="relative w-full rounded-md shadow-sm">
                  <input
                    className={cn(
                      "disabled:bg-gray-0 w-full rounded-none rounded-l-md  border-0 p-1.5  text-slate-12 ring-1 ring-inset  placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 disabled:text-slate-10 sm:text-sm sm:leading-6",
                      error ? "ring-red-500" : "ring-slate-7",
                    )}
                    defaultValue={redirectUrl}
                    onChange={(e) => setRedirectUrl(e.target.value)}
                  />
                </div>
              </div>
              <span className="isolate inline-flex rounded-none rounded-r-md ">
                <>
                  <button
                    type="button"
                    className={`-ml-px inline-flex items-center gap-x-1.5 rounded-none border-x-0   p-2 text-sm font-semibold text-slate-12 ring-1 ring-inset ring-slate-7  focus:z-10`}
                    onClick={() => {
                      setEdit(false)
                    }}
                  >
                    <XMarkIcon className=" h-5 w-5 text-gray-400" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className={`-ml-px inline-flex items-center rounded-none rounded-r-md p-2 text-sm font-semibold text-slate-12 ring-1 ring-inset ring-slate-7  focus:z-10`}
                    onClick={async () => {
                      const updatedCheckoutLink = await editCheckoutLinkAction({
                        id: checkoutLink.id,
                        redirect,
                        redirectUrl: prependProtocol(redirectUrl),
                      })
                      if (updatedCheckoutLink) setEdit(false)
                    }}
                  >
                    <LiaSaveSolid className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                  </button>
                </>
              </span>
            </span>
            {error && <span className="text-sm text-red-500">Please enter a valid URL</span>}
          </span>
        ) : (
          <span className={cn("mr-3 h-fit italic leading-6 sm:col-span-2", checkoutLink.redirect ? "text-theme-secondary " : "text-gray-400")}>
            {checkoutLink?.redirectUrl || "--"}
          </span>
        )}
        {!edit && (
          <span className="isolate inline-flex rounded-md ">
            <Button variant="ghost" ml="2" size="1" color="gray" onClick={() => setEdit(true)}>
              <PencilIcon width="15" height="15" />
            </Button>
          </span>
        )}
      </span>
    </>
  )
}

export function CreateCheckoutLink({ productId, collectionId }: { productId?: string; collectionId?: string }) {
  if (!productId && !collectionId) return null

  return (
    <tr>
      <td className="w-full px-4 py-6 sm:gap-4 sm:px-6" colSpan={9999}>
        <div className="flex w-full flex-row justify-start md:justify-end">
          <button
            onClick={() => createCheckoutLinkAction({ productId, collectionId })}
            className="block rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-slate-12 shadow-sm ring-1 ring-inset ring-slate-7 hover:bg-gray-2 dark:bg-slate-1"
          >
            New Checkout Link
          </button>
        </div>
      </td>
    </tr>
  )
}

export function CopyURL({ url }: { url: string }) {
  return (
    <div className="flex w-full rounded-md shadow-sm">
      <div className="relative w-full rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <LinkIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
          className="disabled:bg-gray-0 w-full rounded-none rounded-l-md border-0 bg-slate-1 py-1.5 pl-10 text-slate-12 ring-1 ring-inset ring-slate-7 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 disabled:text-slate-10 sm:text-sm sm:leading-6"
          defaultValue={url}
          disabled
        />
      </div>
      <button
        type="button"
        className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-slate-12 ring-1 ring-inset ring-slate-7 hover:bg-gray-2"
        onClick={async () => {
          await navigator.clipboard.writeText(url)
          toast.success("Copied!")
        }}
      >
        <DocumentDuplicateIcon className="-ml-0.5 h-5 w-5 text-gray-400" aria-hidden="true" />
      </button>
    </div>
  )
}

export function EllipsesMenu({ checkoutLinkId }: { checkoutLinkId: string }) {

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <EllipsesMenuTrigger />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item
          onClick={async () =>
            await editCheckoutLinkAction({
              id: checkoutLinkId,
              status: CheckoutLinkStatus.ARCHIVED,
            })
          }
        >
          Archive
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

function QRCode({ url }: { url: string }) {
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${url}`
  const [show, setShow] = useState(false)
  const copyImageToClipboard = async () => {
    try {
      const canvas = document.createElement("canvas")
      const img = document.createElement("img")
      img.crossOrigin = "anonymous" // Allow cross-origin access to the image
      img.src = qrSrc
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext("2d")
        ctx?.drawImage(img, 0, 0)
        canvas.toBlob((blob) => {
          const data = [new ClipboardItem({ ["image/png"]: blob })]
          navigator.clipboard.write(data).then(
            () => {
              toast.success("Copied image to clipboard")
            },
            () => {
              toast.error("Image copy error")
            },
          )
        })
      }
    } catch (error) {
      console.error(error)
      toast("Failed to copy image to clipboard")
    }
  }

  const saveImageAsPng = () => {
    try {
      const canvas = document.createElement("canvas")
      const img = document.createElement("img")
      img.crossOrigin = "anonymous" // Allow cross-origin access to the image
      img.src = qrSrc
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext("2d")
        ctx?.drawImage(img, 0, 0)
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob)
          const link = document.createElement("a")
          link.download = "qr-code.png"
          link.href = url
          link.click()
        })
      }
    } catch (error) {
      console.error(error)
      toast("Failed to save image as PNG")
    }
  }

  return (
    <Text>
      <HoverCard.Root>
        <HoverCard.Trigger>
          <QrCodeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" onClick={() => setShow(true)} />
        </HoverCard.Trigger>
        <HoverCard.Content>
          <Flex gap="4" direction="column">
            <Flex width="100%" justify="center" align="center">
              <img src={qrSrc} alt="QR Code" />
            </Flex>
            <Flex direction="row" gap="3" width="100%" justify="center" align="center">
              <Button size="2" onClick={copyImageToClipboard} variant="surface">
                Copy
              </Button>
              <Button size="2" onClick={saveImageAsPng}>
                Save
              </Button>
            </Flex>
          </Flex>
        </HoverCard.Content>
      </HoverCard.Root>
    </Text>
  )
}
