import type { Payment, Product } from "@prisma/client"
import { render } from "@react-email/render"

import PaymentReceivedEmail from "../emails/PaymentReceivedEmail"
import { resend } from "../resend"

export default async function sendPaymentReceivedEmailToSeller(
  NODE_ENV: string,
  recipientEmailAddress: string,
  recipientName: string,
  subject: string,
  payment: Payment,
  product: Product,
) {
  try {
    await resend.emails.send({
      from: NODE_ENV === `Supra ` + "production" ? "<notifications@suprapayments.io>" : "<notifications@suprapayments.dev>",
      to: `${recipientName} <${recipientEmailAddress}>`,
      subject: subject,
      html: render(<PaymentReceivedEmail payment={payment} product={product} />),
    })
  } catch (error) {
    console.log(error)
    await resend.emails.send({
      from: NODE_ENV === `Supra ` + "production" ? "<notifications@suprapayments.io>" : "<notifications@suprapayments.dev>",
      to: `TJW <suprapayments@gmail.com>`,
      subject: "sendPaymentReceivedEmailToSeller Error: " + subject,
      html: render(<PaymentReceivedEmail payment={payment} product={product} />),
    })
  }
}
