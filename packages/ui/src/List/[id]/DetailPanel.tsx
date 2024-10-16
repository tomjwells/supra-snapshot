"use client"

import React from "react"
import { Box, Flex, Inset } from "@radix-ui/themes"

import Panel from "../../Panel"

export default function DetailPanel({
  children,
  title,
  subtitle,
  RightHeadingActions,
  fullWidth = false,
}: {
  children: React.ReactNode
  title?: string
  subtitle?: string
  RightHeadingActions?: React.ReactNode
  fullWidth?: boolean
}) {
  return (
    <Panel>
      <Flex direction="column">
        {(title ?? subtitle) && (
          <Inset clip="padding-box" side="top" pb={fullWidth ? "0" : "current"}>
            <Heading title={title} subtitle={subtitle} RightHeadingActions={RightHeadingActions} />
          </Inset>
        )}
        {fullWidth ? (
          <Inset clip="padding-box" side="bottom" className="!overflow-visible">
            {children}
          </Inset>
        ) : (
          <div className="flex-1">{children}</div>
        )}
      </Flex>
    </Panel>
  )
}

function Heading({ title, subtitle, RightHeadingActions }: { title?: string; subtitle?: string; RightHeadingActions?: React.ReactNode }) {
  return (
    <Box className="bg-slate-2" p="4" px="5">
      <Flex justify="between" align="center">
        <div>
          {title && <h3 className="text-base font-semibold leading-7 text-slate-12">{title}</h3>}
          {subtitle && <p className="max-w-2xl text-sm leading-6 text-slate-10">{subtitle}</p>}
        </div>
        {RightHeadingActions}
      </Flex>
    </Box>
  )
}
