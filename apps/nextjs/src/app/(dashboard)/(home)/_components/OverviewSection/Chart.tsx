"use client"

import type { Network } from "@acme/db"
import { formatCurrency } from "@acme/utils"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

export function Chart({ data, network }: { data: { name: string; total: number }[]; network: Network }) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value: string) => formatCurrency(value, network, "ADA", 0)} />
        <Bar
          dataKey="total"
          fill="rgb(30 64 175)" 
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
