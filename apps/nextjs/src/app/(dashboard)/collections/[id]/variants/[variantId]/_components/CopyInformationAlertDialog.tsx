"use client"

import { AlertDialog, Button, Flex } from "@radix-ui/themes"

export default function CopyInformationAlertDialog({ action }: { action: () => Promise<void> }) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <span className="rounded-md bg-transparent shadow-sm">
          <Button variant="surface" size="2" color="gray">
            Apply to all Variants
          </Button>
        </span>
      </AlertDialog.Trigger>
      <AlertDialog.Content style={{ maxWidth: 450 }}>
        <AlertDialog.Title>Copy Data</AlertDialog.Title>
        <AlertDialog.Description size="2">
          This operation will overwrite the data of all variants in this collection with the information from this section. Do you wish to continue?
        </AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button variant="solid" color="blue" onClick={() => action()}>
              Continue
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}
