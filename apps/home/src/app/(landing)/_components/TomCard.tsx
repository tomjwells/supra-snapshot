import React from "react"
import { cn } from "@acme/shadcn/utils/cn"

export default function Panel({ variant, onMouseEnter, children }: { variant: "ghost" | "active"; onMouseEnter?: () => void; children: React.ReactNode }) {
  return (
    <button
      className={cn(
        "flex flex-col",
        "focus:transform-[translateY(-2px)] focus:bg-panel focus:shadow-[inset_0_0_0_1px_#0954a5,_0_0_0_1px_#0954a5]", // focus
        "hover:transform-[translateY(-2px)] hover:bg-panel", //hover
        variant === "active" && "transform-[translateY(-2px)] bg-panel", //active
      )}
      onMouseEnter={onMouseEnter}
      onClick={onMouseEnter} // To make sure it works on touch-screens/phones
      style={{
        margin: "0",
        padding: "var(--space-3)",
        marginBottom: "var(--space-2)",
        width: "100%",
        textTransform: "none",
        backgroundImage: "none",
        cursor: "pointer",
        appearance: "none",
        border: "none",
        fontStyle: "inherit",
        fontVariant: "inherit",
        fontWeight: "inherit",
        fontStretch: "inherit",
        fontSize: "inherit",
        fontFamily: "inherit",
        fontOpticalSizing: "inherit",
        fontKerning: "inherit",
        fontFeatureSettings: "inherit",
        fontVariationSettings: "inherit",
        lineHeight: "1",
        outline: "none",
        textAlign: "inherit",
        verticalAlign: "middle",
        WebkitTapHighlightColor: "rgba(0, 0, 0, 0)",
        textDecoration: "none",
        color: "inherit",
        flexShrink: "0",
        borderRadius: "var(--radius-4)",
        position: "relative",
        transition: "none 0s ease 0s",
      }}
    >
      {children}
    </button>
  )
}
