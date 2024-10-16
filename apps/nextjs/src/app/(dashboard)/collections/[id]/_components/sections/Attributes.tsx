"use client"

import React, { useEffect, useState } from "react"
import { Form, FormControl, FormField, FormItem } from "@acme/shadcn/form"
import { EditButtons } from "@acme/ui"
import { Input } from "@acme/ui/Forms/Input"
import DetailPanel from "@acme/ui/List/[id]/DetailPanel"
import EmptyRow from "@acme/ui/Table/EmptyRow"
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid"
import { zodResolver } from "@hookform/resolvers/zod"
import { DragHandleDots2Icon, PlusIcon } from "@radix-ui/react-icons"
import { Button, Dialog, DropdownMenu, Flex, Grid, Table, Text } from "@radix-ui/themes"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
import type { DraggableProvided, DroppableProps, DroppableProvided } from "react-beautiful-dnd"
import { useForm, useFormContext } from "react-hook-form"
import { z } from "zod"

import type { CollectionType } from "~/_backend/collections"
import { updateAttributesAction } from "./_attributeActions"

const updateAttributesSchema = z.object({
  mode: z.enum(["dry-run", "wet-run"]),
  collectionId: z.string(),
  attributes: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      orderIndex: z.number().int().min(0),
      values: z.array(
        z.object({
          id: z.string(),
          value: z.string(),
          orderIndex: z.number().int().min(0),
        }),
      ),
    }),
  ),
})

export default function Attributes({ collection }: { collection: CollectionType }) {
  const [provisionalChanges, setProvisionalChanges] = React.useState<Awaited<ReturnType<typeof updateAttributesAction>> | null>(null)
  const [edit, setEdit] = React.useState(false)
  const formAttribute = "attributes"

  const form = useForm<
    z.infer<typeof updateAttributesSchema> & {
      attributes: NonNullable<CollectionType>["attributes"]
    }
  >({
    resolver: zodResolver(updateAttributesSchema),
    defaultValues: {
      id: collection.id,
      mode: "wet-run",
      attributes: collection?.attributes ?? [],
    },
  })

  const onSubmit = async (data: typeof updateAttributesSchema) => {
    console.log("submitted data:", data)

    const updatedAttributes = await updateAttributesAction({
      ...data,
      mode: "dry-run",
    })
    setProvisionalChanges(updatedAttributes)
  }

  function onDragEnd(result: any) {
    if (!result.destination) {
      return
    }

    const items = form.getValues("attributes")
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    form.setValue("attributes", items)
    for (const [index] of items.entries()) {
      form.setValue(`attributes.${index}.orderIndex`, index)
    }
  }

  if (!collection) return null
  return (
    <Form {...form}>
      <ConfirmChangeModal provisionalChanges={provisionalChanges} setProvisionalChanges={setProvisionalChanges} edit={edit} setEdit={setEdit} />
      <form id={formAttribute} onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <DetailPanel
          title="Attributes"
          subtitle="Add attributes to your product for customers to choose from."
          fullWidth
          RightHeadingActions={<EditButtons edit={edit} setEdit={setEdit} formAttribute={formAttribute} />}
        >
          <DragDropContext onDragEnd={onDragEnd}>
            <StrictModeDroppable droppableId="attributes">
              {(provided: DroppableProvided) => (
                <Table.Root
                  className="w-full"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{
                    tableLayout: "fixed",
                  }}
                >
                  {!edit && (
                    <Table.Header>
                      <Table.Row>
                        <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Options</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Selection Type</Table.ColumnHeaderCell>
                      </Table.Row>
                    </Table.Header>
                  )}
                  <Table.Body className="[&>*:last-child]:[--table-row-box-shadow:none]">
                    {!edit &&
                      collection.attributes
                        .sort((a, b) => a.orderIndex - b.orderIndex)
                        .map((attribute, _index) => <Row key={attribute.id} attribute={attribute} />)}
                    {!edit && collection.attributes.sort((a, b) => a.orderIndex - b.orderIndex).length === 0 && (
                      <EmptyRow text="This collection has no attributes." />
                    )}
                    {edit &&
                      form.watch("attributes").map((attribute, index) => (
                        <Draggable key={attribute.id} draggableId={attribute.id} index={index}>
                          {(provided: DraggableProvided) => (
                            <Table.Row ref={provided.innerRef} {...provided.draggableProps}>
                              <Table.Cell style={{ display: "table", borderBottomWidth: "1px" }} width="100%">
                                <Flex direction="row" width="100%" p="4" className="rounded-md bg-[var(--color-panel)]">
                                  <span {...provided.dragHandleProps} className="p-3">
                                    <DragHandleDots2Icon />
                                  </span>
                                  <EditRow key={attribute.id} index={index} attribute={attribute} />
                                </Flex>
                              </Table.Cell>
                            </Table.Row>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                    {edit && (
                      <Table.Row align="center">
                        <Table.Cell colSpan={9999} align="right" px="4" py="6">
                          <AddAttributeButton collectionId={collection.id} />
                        </Table.Cell>
                      </Table.Row>
                    )}
                  </Table.Body>
                </Table.Root>
              )}
            </StrictModeDroppable>
          </DragDropContext>
        </DetailPanel>
      </form>
    </Form>
  )
}

function EditRow({ index, attribute }: { index: number; attribute: NonNullable<CollectionType>["attributes"][number] }) {
  const form = useFormContext()
  return (
    <Grid columns="3" p="2" gap="3" gapY="5" width="100%">
      <AttributeNameField attribute={attribute} index={index} />
      <Text color="gray" className="text-sm font-medium text-slate-12">
        Options
      </Text>
      <Flex direction="column" gap="3" className="col-span-2">
        {attribute.values.map((value, valueIndex) => (
          <Flex direction="row" key={value.id}>
            <input type="hidden" {...form.register(`attributes.${index}.values.${valueIndex}.id`)} defaultValue={value.id} />
            <input
              type="hidden"
              {...form.register(`attributes.${index}.values.${valueIndex}.orderIndex`, {
                valueAsNumber: true,
              })}
              defaultValue={valueIndex}
            />
            <span className="flex-grow">
              <FormField
                control={form.control}
                name={`attributes.${index}.values.${valueIndex}.value`}
                defaultValue={value.value ?? undefined}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </span>
            <span className="flex items-center px-3">
              <EllipsesValueMenu valueId={value.id} valueIndex={valueIndex} attributeIndex={index} />
            </span>
          </Flex>
        ))}
        <Flex justify="end">
          <AddAttributeValueButton attributeIndex={index} />
        </Flex>
      </Flex>
      <Text color="gray" className="text-sm font-medium text-slate-12">
        Selection Type
      </Text>
      <Text className="col-span-2">Dropdown</Text>
    </Grid>
  )
}

function AttributeNameField({ attribute, index }: { attribute: NonNullable<CollectionType>["attributes"][number]; index: number }) {
  const form = useFormContext()

  return (
    <>
      <Text color="gray" className="text-sm font-medium text-slate-12">
        Attribute Name
      </Text>
      <FormField
        control={form.control}
        name={`attributes.${index}.name`}
        defaultValue={attribute.name ?? undefined}
        render={({ field }) => (
          <FormItem className="col-span-2  ">
            <FormControl>
              <div className="flex w-full flex-row">
                <span className="flex-grow">
                  <Input {...field} />
                </span>
                <span className="flex items-center px-3">
                  <EllipsesAttributeMenu attributeIndex={index} />
                </span>
              </div>
            </FormControl>
          </FormItem>
        )}
      />
    </>
  )
}

export function Row({ attribute }: { attribute: NonNullable<CollectionType>["attributes"][number] }) {
  return (
    <Table.Row>
      <Table.Cell py="4">
        <Text>{attribute.name}</Text>
      </Table.Cell>
      <Table.Cell py="4">
        <Text>{attribute.values.map((v) => v.value).join(", ")}</Text>
      </Table.Cell>
      <Table.Cell py="4">
        Dropdown
      </Table.Cell>
    </Table.Row>
  )
}

export function AddAttributeValueButton({ attributeIndex }: { attributeIndex: number }) {
  const form = useFormContext()

  return (
    <Button
      className="!text-sm !font-semibold !text-slate-12 !shadow-sm !ring-1 !ring-inset !ring-slate-7 hover:!bg-gray-2 dark:!bg-slate-1 "
      variant="outline"
      highContrast
      onClick={(e) => {
        e.preventDefault()
        console.log("clicked")
        form.setValue(`attributes.${attributeIndex}.values`, [
          ...form.getValues(`attributes.${attributeIndex}.values`),
          {
            id: "",
            value: "",
          },
        ])
        console.log([
          ...form.getValues(`attributes.${attributeIndex}.values`),
          {
            id: "",
            value: "",
          },
        ])
      }}
    >
      <PlusIcon width="16" height="16" /> Add Option
    </Button>
  )
}
export function AddAttributeButton({ collectionId }: { collectionId: string }) {
  const form = useFormContext()
  if (!collectionId) return null

  return (
    <Button
      className="!text-sm !font-semibold !text-slate-12 !shadow-sm !ring-1 !ring-inset !ring-slate-7 hover:!bg-gray-2 dark:!bg-slate-1 "
      variant="outline"
      highContrast
      onClick={(e) => {
        e.preventDefault()
        console.log("clicked")
        form.setValue(`attributes`, [
          ...form.getValues(`attributes`),
          {
            id: "",
            name: "",
            orderIndex: form.getValues(`attributes`).length,
            values: [
              {
                id: "",
                value: "",
              },
            ],
          },
        ])
      }}
    >
      <PlusIcon width="16" height="16" /> Add Attribute
    </Button>
  )
}

export const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
  const [enabled, setEnabled] = useState(false)
  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true))
    return () => {
      cancelAnimationFrame(animation)
      setEnabled(false)
    }
  }, [])
  if (!enabled) {
    return null
  }
  return <Droppable {...props}>{children}</Droppable>
}

function EllipsesAttributeMenu({ attributeIndex }: { attributeIndex: number }) {
  const form = useFormContext()

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <EllipsisVerticalIcon className="h-5 w-5 text-slate-10 hover:text-slate-11" aria-hidden="true" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item
          color="red"
          onClick={() => {
            form.setValue(
              `attributes`,
              form.getValues(`attributes`).filter((_, i) => i !== attributeIndex),
            )
          }}
        >
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
function EllipsesValueMenu({ valueIndex, attributeIndex }: { valueId: string; valueIndex: number; attributeIndex: number }) {
  const form = useFormContext()

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <EllipsisVerticalIcon className="h-5 w-5 text-slate-10 hover:text-slate-11" aria-hidden="true" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item
          color="red"
          onClick={() => {
            form.setValue(
              `attributes.${attributeIndex}.values`,
              form.getValues(`attributes.${attributeIndex}.values`).filter((_, i) => i !== valueIndex),
            )
          }}
        >
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

function ConfirmChangeModal({
  provisionalChanges,
  setProvisionalChanges,
  edit,
  setEdit,
}: {
  provisionalChanges: Awaited<ReturnType<typeof updateAttributesAction>> | null
  setProvisionalChanges: React.Dispatch<React.SetStateAction<any>>
  edit: boolean
  setEdit: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const form = useFormContext()

  if (provisionalChanges?.createdVariantCount === 0 && provisionalChanges?.deletedVariantCount === 0) {
    return null
  }

  async function onSubmit(data: z.infer<typeof updateAttributesSchema>) {
    console.log({ data })
    const updatedAttributes = await updateAttributesAction(data)
    if (updatedAttributes) {
      setEdit(false)
    }
  }

  return (
    <Dialog.Root open={!!provisionalChanges && edit}>
      <Dialog.Content>
        <Dialog.Title>Confirm Changes</Dialog.Title>
        <Dialog.Description>
          This operation will make the following changes:
          <br />
          <br />
          <ul>
            {provisionalChanges?.createdVariantCount && provisionalChanges?.createdVariantCount > 0 && (
              <li>
                • Create {provisionalChanges?.createdVariantCount} new variant{provisionalChanges?.createdVariantCount > 1 && "s"}
              </li>
            )}
            {provisionalChanges?.deletedVariantCount && provisionalChanges?.deletedVariantCount > 0 && (
              <li>
                • Delete {provisionalChanges?.deletedVariantCount} variant{provisionalChanges?.deletedVariantCount > 1 && "s"}
              </li>
            )}
          </ul>
          <br />
        </Dialog.Description>
        Would you like to continue?
        <Flex gap="3" justify="end">
          <Dialog.Close>
            <Button
              variant="soft"
              color="gray"
              onClick={() => {
                setProvisionalChanges(null)
              }}
            >
              Cancel
            </Button>
          </Dialog.Close>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Button type="submit" variant="soft" color="blue">
              Confirm
            </Button>
          </form>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  )
}
