import { Resend } from "resend"

// @ts-ignore mjs
import { env } from "./env.ts"

export const resend = new Resend(env.RESEND_API_KEY)
