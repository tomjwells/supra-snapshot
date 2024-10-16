import { Suspense } from "react"
import { Separator, Text } from "@radix-ui/themes"

import { PlanForm } from "./plan-form"

export default function SettingsAppearancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Plan</h3>
        <Text size="2" className="text-gray-10">
          Choose a plan that fits your use case.
        </Text>
      </div>
      <Separator style={{ width: "100%" }} />

      <Suspense>
        <PlanForm />
      </Suspense>
    </div>
  )
}
