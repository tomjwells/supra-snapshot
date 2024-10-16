import { revalidatePath } from "next/cache"
import { OrganizationTier, prisma } from "@acme/db"
import { RadioGroup, RadioGroupItem } from "@acme/shadcn/radio-group"
import { Flex, Link, Text } from "@radix-ui/themes"
import { z } from "zod"

import { getOrganization } from "~/_backend/organizations"
// @ts-ignore cjs
import { env } from "~/env.ts"
import { auth } from "~/utils/auth"
import { ConfettiComponent } from "./Confetti"

export async function PlanForm() {
  const session = await auth()
  if (!session || !session.user) return null
  const organization = await getOrganization()

  async function updatePlan(formData: FormData) {
    "use server"
    const data = z.object({ tier: z.nativeEnum(OrganizationTier) }).parse(Object.fromEntries(formData))
    if (!session) return null
    await prisma.organization.update({
      where: {
        id: session.user.selectedOrganizationId,
      },
      data,
    })
    revalidatePath("/")
  }

  return (
    <>
      <div className="space-y-1">
        <label>Tiers</label>
        <p className="text-sm text-muted-foreground">
          See the{" "}
          <Link target="_blank" href={env.NEXT_PUBLIC_HOMEPAGE_URL + "/pricing"}>
            Pricing
          </Link>{" "}
          page for more details.
        </p>
      </div>
      <form action={updatePlan} className="pt-2">
        <Flex justify="center">
          <ConfettiComponent tier={organization.tier} />
        </Flex>
        <RadioGroup defaultValue={organization.tier} name="tier">
          <Flex direction="row" className="space-x-2">
            <label className="w-52 [&:has([data-state=checked])>div]:border-slate-10">
              <RadioGroupItem type="submit" value={OrganizationTier.FREE} className="sr-only" />
              <div className="items-center rounded-md border border-muted p-1 hover:border-accent">
                <div className="space-y-2 rounded-sm bg-[#ecedef] p-2 dark:bg-gray-1">
                  <div className="space-y-2 rounded-md bg-white p-2 shadow-sm dark:bg-gray-3">
                    <Text weight="bold">Free</Text>
                  </div>
                </div>
              </div>
              <span className="block w-full p-2 text-center font-normal">Free Tier</span>
            </label>
            <label className="w-52 [&:has([data-state=checked])>div]:border-slate-10">
              <RadioGroupItem type="submit" value={OrganizationTier.PROFESSIONAL} className="sr-only" />
              <div className="items-center rounded-md border border-muted p-1 hover:border-accent">
                <div className="space-y-2 rounded-sm bg-[#ecedef] p-2 dark:bg-gray-1">
                  <div className="space-y-2 rounded-md bg-white p-2 shadow-sm dark:bg-gray-3">
                    <Text weight="bold">Professional</Text>
                  </div>
                </div>
              </div>
              <span className="block w-full p-2 text-center font-normal">Professional</span>
            </label>
          </Flex>
        </RadioGroup>
      </form>
    </>
  )
}
