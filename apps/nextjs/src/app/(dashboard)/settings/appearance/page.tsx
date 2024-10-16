import { Separator, Text } from "@radix-ui/themes"

import { AppearanceForm } from "./appearance-form"

export default function SettingsAppearancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Appearance</h3>
        <Text size="2" className="text-gray-10">
          Customize the appearance of the app. Automatically switch between day and night themes.
        </Text>
      </div>
      <Separator style={{ width: "100%" }} />
      <AppearanceForm />
    </div>
  )
}
