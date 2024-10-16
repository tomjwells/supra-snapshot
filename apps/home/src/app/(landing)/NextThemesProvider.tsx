"use client"

import React from "react"
import { ThemeProvider } from "next-themes"

export const NextThemesProvider = ({ children, defaultTheme = "dark" }: { children: React.ReactNode; defaultTheme?: string | "dark" }) => (
  <ThemeProvider
    attribute="class"
    defaultTheme={defaultTheme}
    disableTransitionOnChange
  >
    {children}
  </ThemeProvider>
)
