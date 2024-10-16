import React from "react"

export default function EmptyRow({ text }: { text: React.ReactNode }) {
  return (
    <tr className="overflow-hidden  text-center">
      <td colSpan={9999} className="py-4  text-theme-secondary">
        {text}
      </td>
    </tr>
  )
}
