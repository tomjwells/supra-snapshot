"use client"

import { cn } from "@acme/shadcn"
import { PlusSmallIcon } from "@heroicons/react/20/solid"
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline"
import { Button } from "@radix-ui/themes"

export function NewResourceButton({ resource, onClick, isLoading }: { resource: string; onClick?: () => void; isLoading?: boolean }) {
  return <IconButton Icon={PlusSmallIcon} text={`New ${resource}`} onClick={onClick} isLoading={isLoading} />
}
export function DuplicateResourceButton({ resource, onClick, isLoading }: { resource: string; onClick?: () => void; isLoading?: boolean }) {
  return <IconButton Icon={DocumentDuplicateIcon} text={`Duplicate ${resource}`} onClick={onClick} isLoading={isLoading} color="#6E6ADE" />
}

export function IconButton({
  Icon,
  text,
  onClick,
  isLoading,
  color = "rgb(52 81 178)",
}: {
  Icon: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
      title?: string | undefined
      titleId?: string | undefined
    } & React.RefAttributes<SVGSVGElement>
  >
  text: string
  onClick?: () => void
  isLoading?: boolean
  color?: string
}) {
  return (
    <Button onClick={onClick} disabled={isLoading}>
      <div className="relative">
        <LoadingButtonSpinner isLoading={isLoading} />
        <div className={cn(isLoading && "invisible", "z-10 flex flex-row")}>
          <Icon className="-ml-1.5 h-5 w-5" aria-hidden="true" />
          {text}
        </div>
      </div>
    </Button>
  )
}

export function LoadingButtonSpinner({ isLoading }: { isLoading: boolean | undefined }) {
  return (
    <span
      className={cn(!isLoading && "hidden", "absolute")}
      style={{
        left: "50%",
        top: "50%",
        transform: "translate(-50%,-50%)",
      }}
    >
      <svg className="h-4 w-4 animate-spin" width="24" height="24" viewBox="0 0 24 24">
        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    </span>
  )
}
