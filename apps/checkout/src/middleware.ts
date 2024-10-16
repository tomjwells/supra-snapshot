import type { IncomingMessage } from "http"
import { NextResponse } from "next/server"

import { env } from "./env"

export default function middleware(req: IncomingMessage): NextResponse {
  if (req.url) {
    const url = new URL(req.url, `http://${req.headers.host}`)
    if (url.pathname == "/" || url.pathname == "") {
      return NextResponse.redirect(new URL(env.NEXT_PUBLIC_HOMEPAGE_URL))
    }
  }
  return NextResponse.next()
}
