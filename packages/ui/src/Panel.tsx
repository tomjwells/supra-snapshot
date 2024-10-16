import { cn } from "@acme/shadcn/utils/cn"
import { Card } from "@radix-ui/themes"

export default function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <Card
      size="3"
      className={cn(
        className,
        "  after:shadow-[0_0_0_1px_var(--gray-a5)]",
        "[&>*]:overflow-visible",
      )}
    >
      {children}
    </Card>
  )
}
