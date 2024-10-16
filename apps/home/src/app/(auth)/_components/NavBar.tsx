import Link from "next/link"
import { SupraImageLogoSVG } from "@acme/ui/Brand/SupraLogo"
import { LOGIN_URL, REGISTER_URL } from "@data/constants"
import { Button } from "@radix-ui/themes"

export default function NavBar({ mode }: { mode: "login" | "signup" }) {
  return (
    <header className="flex items-center justify-between px-8 py-4">
      <SupraImageLogoSVG height={37} width={37} />
      <nav className="flex items-center space-x-4">
        <Link href={mode === "login" ? REGISTER_URL : LOGIN_URL} className="cursor-pointer">
          <Button variant="outline" color="gray" size="2" highContrast>
            {mode === "login" ? "Sign Up" : "Sign In"}
          </Button>
        </Link>
      </nav>
    </header>
  )
}
