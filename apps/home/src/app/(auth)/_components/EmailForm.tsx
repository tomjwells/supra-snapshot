"use client"

import React, { useState } from "react"
import { useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { toast } from "sonner"

import Button from "./button"

export default function EmailForm() {
  const searchParams = useSearchParams()
  const [showEmailOption, setShowEmailOption] = useState(false)
  const [email, setEmail] = useState("")
  const [clickedGoogle, setClickedGoogle] = useState(false)
  const [clickedGitHub, setClickedGitHub] = useState(false)
  const [clickedEmail, setClickedEmail] = useState(false)
  const [showSSOOption, setShowSSOOption] = useState(false)
  const [noSuchAccount, setNoSuchAccount] = useState(false)
  const [clickedSSO, setClickedSSO] = useState(false)

  React.useEffect(() => {
    const error = searchParams?.get("error")
    error && toast.error(error)
  }, [searchParams])

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        setClickedEmail(true)
        void (await signIn("resend", {
          email,
          redirect: false,
        })
          .then((res) => {
            setClickedEmail(false)
            if (res?.ok && !res?.error) {
              setEmail("")
              toast.success("Email sent - check your inbox!")
            } else {
              toast.error("Error sending email - try again?")
            }
          })
          .catch((e) => {
            console.log("err path 2")
            console.error(e)
            setClickedEmail(false)
            toast.error("Error sending email - try again?")
          }))
       
      }}
      className="flex flex-col space-y-3"
    >
      {showEmailOption && (
        <div>
          <div className="mb-4 mt-1 border-t border-gray-4" />
          <input
            id="email"
            name="email"
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            type="email"
            placeholder="email@example.com"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => {
              setNoSuchAccount(false)
              setEmail(e.target.value)
            }}
            className="mt-1 block w-full appearance-none rounded-md border border-gray-4 bg-slate-1 px-3 py-2 text-white placeholder-gray-500 shadow-sm focus:border-gray-9 focus:outline-none focus:ring-gray-9 sm:text-sm"
          />
        </div>
      )}
      <Button
        text="Continue with Email"
        variant="secondary"
        {...(!showEmailOption && {
          type: "button",
          onClick: (e) => {
            e.preventDefault()
            setShowSSOOption(false)
            setShowEmailOption(true)
          },
        })}
        loading={clickedEmail}
        disabled={clickedGoogle || clickedGitHub || clickedSSO}
      />
    </form>
  )
}
