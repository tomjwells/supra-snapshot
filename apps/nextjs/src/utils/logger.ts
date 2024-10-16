import { env } from "~/env.ts"

export const logger = {
  log: (...args: any[]) => {
    if (env.NEXT_PUBLIC_NODE_ENV === "development") {
      console.log(`%clogger: `, "background: blue; color: white; font-weight: bold;", ...args)
    }
  },
}
