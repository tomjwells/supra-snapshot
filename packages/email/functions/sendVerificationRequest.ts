
import { MagicLinkEmail } from "../emails/MagicLinkEmail"
import { resend } from "../resend"

export async function sendVerificationRequest(params: {
  identifier: string
  url: string
  expires: Date
  // @ts-expect-error
  provider: EmailConfig
  token: string
  // @ts-expect-error
  theme: Theme
  request: Request
}) {
  const { identifier, url } = params
  const { host } = new URL(url)

  try {
    const data = await resend.emails.send({
      from: "login@suprapayments.io",
      to: [identifier],
      subject: `Log in to ${host}`,
      text: text({ url, host }),
      react: MagicLinkEmail({ url, host }),
    })
    // { success: true, data }
    return
  } catch (error) {
    throw new Error("Failed to send the verification Email.")
  }
}

function text({ url, host }: { url: string; host: string }) {
  return `Sign in to ${host}\n${url}\n\n`
}
