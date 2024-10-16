import Link from "next/link"
import { auth } from "@acme/auth"
import { NavigationMenu, NavigationMenuList } from "@acme/shadcn/navigation-menu"
import { LOGIN_URL, REGISTER_URL } from "@data/constants"
import { Button } from "@radix-ui/themes"
import { APP_DOMAIN } from "data/constants"

import { AceternityButton, CursorStyleDownloadButton3 } from "~/components/TailwindButtons"
import { NavMenuItem } from "./NavigationMenu"

export const fontStyles = {
  lineHeight: "15px",
  fontSize: "15px",
  fontFamily:
    "var(--fonts-untitled),ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji",
  textUnderlineOffset: "3px",
  textDecorationColor: "var(--slate-4)",
  borderImageOutset: "0",
  borderImageSlice: "100%",
  borderImageRepeat: "stretch",
  borderImageSource: "none",
  borderImageWidth: "1",
  display: "block",
}

export default async function RightNav() {
  const session = await auth()

  return (
    <nav className="flex flex-row justify-end">
      {session ? (
        <Button className="shadow" style={{ fontFamily: fontStyles.fontFamily }} asChild>
          <Link href={APP_DOMAIN}>Dashboard</Link>
        </Button>
      ) : (
        <SignInSignUpButtons />
      )}
    </nav>
  )
}

export function SignInSignUpButtons() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavMenuItem href={LOGIN_URL}>Log In</NavMenuItem>
        <span className="w-4" />
        <AceternityButton
          href={REGISTER_URL}
          text="Get Started"
          className="flex sm:hidden md:flex"
        />
      </NavigationMenuList>
    </NavigationMenu>
  )
}
