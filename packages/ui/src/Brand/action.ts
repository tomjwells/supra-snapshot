"use server"

import { tg } from "@acme/analytics-telegram"
import { z } from "zod"

export async function tgAction(input: { projectUrl: string; path: string; error: string }) {
  const data = z
    .object({
      projectUrl: z.string().optional(),
      path: z.string(),
      error: z.string(),
    })
    .parse(input)
  tg.error(data.projectUrl + data.path, data.error)

  return { success: true }
}
