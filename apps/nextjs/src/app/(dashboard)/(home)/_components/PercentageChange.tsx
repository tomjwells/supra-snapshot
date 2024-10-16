import React from "react"

export default function PercentageChange({
  percentChange,
  absChange,
}: {
  percentChange?: string
  absChange?: string
}) {
  return (
    <>
      {percentChange ? (
        <p className="text-xs text-muted-foreground">
          {["NaN", "Infinity"].includes(percentChange)
            ? ""
            : parseFloat(percentChange) > 0
            ? "+"
            : ""}
          {["NaN", "Infinity"].includes(percentChange)
            ? "--"
            : `${percentChange}%`}{" "}
          from last week
        </p>
      ) : (
        absChange && (
          <p className="text-xs text-muted-foreground">
            {parseFloat(absChange) >= 0 ? "+" : "-"}
            {absChange} from last week
          </p>
        )
      )}
    </>
  )
}
