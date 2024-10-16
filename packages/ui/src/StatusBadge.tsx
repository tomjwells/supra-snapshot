import { cn } from "@acme/shadcn/utils/cn"

type ColorMap = Record<string, string>

const statuses: ColorMap = {
  success: "text-green-11 bg-green-2 ring-green-600/20",
  warning: "text-yellow-800 bg-yellow-2 ring-yellow-600/20",
  neutral: "text-gray-800 bg-white dark:bg-slate-1-2 ring-gray-600/20",
}

export default function StatusBadge({ status, text }: { status: "success" | "warning" | "neutral" | null | false; text: string }) {
  if (!status) return null
  return (
    <p className={cn(statuses[status] ?? "", " mt-0.5 max-w-fit whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset")}>
      {text.toLowerCase()}
    </p>
  )
}
