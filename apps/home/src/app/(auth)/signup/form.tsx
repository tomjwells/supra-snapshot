import Link from "next/link"
import { signIn } from "@acme/auth"

import Button from "../_components/button"
import EmailForm from "../_components/EmailForm"
import { Github, Google } from "../_components/icons"

export default function RegisterForm() {
  return (
    <div className="flex flex-col space-y-3 px-4 py-8 sm:px-16">
      <form
        action={async () => {
          "use server"
          await signIn("google")
        }}
      >
        <Button text="Continue with Google" icon={<Google className="h-4 w-4" />} />
      </form>
      <form
        action={async () => {
          "use server"
          await signIn("github")
        }}
      >
        <Button text="Continue with GitHub" icon={<Github className="h-4 w-4" />} />
      </form>
      <EmailForm />
    </div>
  )
}
