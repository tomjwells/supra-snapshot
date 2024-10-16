import { Separator, Text } from "@radix-ui/themes"

import { DisplayForm } from "./display-form"

export default function SettingsDisplayPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Display</h3>
        <Text size="2" className="text-gray-10">
          Turn items on or off to control what&apos;s displayed in the app.
        </Text>
      </div>
      <Separator />
      <DisplayForm />
    </div>
  )
}
