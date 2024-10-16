import React from "react"
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid"

export const EllipsesMenuTrigger = React.forwardRef<SVGSVGElement>((props, ref) => {
  const classes = "h-7 w-5 rounded-md text-gray-10 hover:bg-gray-2 hover:text-gray-11"
  return <EllipsisVerticalIcon {...props} ref={ref} className={classes} aria-hidden="true" />
})
EllipsesMenuTrigger.displayName = "EllipsesMenuTrigger"
