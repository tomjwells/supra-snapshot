"use client"

import React, { useEffect, useRef, useState } from "react"
import type { FC } from "react"
import { useRouter } from "next/navigation"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons"

import { Button } from "./button"
import { Calendar } from "./calendar"
import { DateInput } from "./date-input"
import { Label } from "./label"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"
import { Switch } from "./switch"
import { cn } from "./utils/cn"

export interface DateRangePickerProps {
  /** Click handler for applying the updates from DateRangePicker. */
  onUpdate?: (values: { range: DateRange; rangeCompare?: DateRange }) => void
  /** Initial value for start date */
  initialDateFrom?: Date | string
  /** Initial value for end date */
  initialDateTo?: Date | string
  /** Initial value for start date for compare */
  initialCompareFrom?: Date | string
  /** Initial value for end date for compare */
  initialCompareTo?: Date | string
  /** Alignment of popover */
  align?: "start" | "center" | "end"
  /** Option for locale */
  locale?: string
  /** Option for showing compare feature */
  showCompare?: boolean
}

const formatDate = (date: Date, locale = "en-us"): string => {
  return date.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

interface DateRange {
  from: Date
  to: Date | undefined
}

interface Preset {
  name: string
  label: string
}

// Define presets
const PRESETS: Preset[] = [
  { name: "today", label: "Today" },
  { name: "yesterday", label: "Yesterday" },
  { name: "last7", label: "Last 7 days" },
  { name: "last14", label: "Last 14 days" },
  { name: "last30", label: "Last 30 days" },
  { name: "thisWeek", label: "This Week" },
  { name: "lastWeek", label: "Last Week" },
  { name: "thisMonth", label: "This Month" },
  { name: "lastMonth", label: "Last Month" },
]

/** The DateRangePicker component allows a user to select a range of dates */
export const DateRangePicker: FC<DateRangePickerProps> & {
  filePath: string
} = ({
  initialDateFrom = new Date(new Date().setHours(0, 0, 0, 0)),
  initialDateTo,
  initialCompareFrom,
  initialCompareTo,
  onUpdate,
  align = "end",
  locale = "en-US",
  showCompare = true,
}): JSX.Element => {
  const router = useRouter()

  const [isOpen, setIsOpen] = useState(false)

  const [range, setRange] = useState<DateRange>({
    from: new Date(new Date(initialDateFrom).setHours(0, 0, 0, 0)),
    to: initialDateTo ? new Date(new Date(initialDateTo).setHours(23, 59, 59, 999)) : new Date(new Date(initialDateFrom).setHours(23, 59, 59, 999)),
  })
  const [rangeCompare, setRangeCompare] = useState<DateRange | undefined>(
    initialCompareFrom
      ? {
          from: new Date(new Date(initialCompareFrom).setHours(0, 0, 0, 0)),
          to: initialCompareTo ? new Date(new Date(initialCompareTo).setHours(0, 0, 0, 0)) : new Date(new Date(initialCompareFrom).setHours(0, 0, 0, 0)),
        }
      : undefined,
  )

  const performUpdate = () => {
    if (!areRangesEqual(range, openedRangeRef.current) || !areRangesEqual(rangeCompare, openedRangeCompareRef.current)) {
      onUpdate?.({ range, rangeCompare })
    }
    if (range.to instanceof Date && range.from instanceof Date) {
      range.from?.setHours(0, 0, 0, 0)
      range.to?.setHours(23, 59, 59, 999)
      router.push(`/?from=${range.from.toISOString()}&to=${range.to?.toISOString()}`)
    }
    console.log(range)
  }
  function performUpdateWithRangeArg(range: DateRange) {
    onUpdate?.({ range, rangeCompare })
    setRange(range)
  }

  // Refs to store the values of range and rangeCompare when the date picker is opened
  const openedRangeRef = useRef<DateRange | undefined>()
  const openedRangeCompareRef = useRef<DateRange | undefined>()

  const [selectedPreset, setSelectedPreset] = useState<string | undefined>(undefined)

  const [isSmallScreen, setIsSmallScreen] = useState(typeof window !== "undefined" ? window.innerWidth < 960 : false)

  useEffect(() => {
    const handleResize = (): void => {
      setIsSmallScreen(window.innerWidth < 960)
    }

    window.addEventListener("resize", handleResize)

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const getPresetRange = (presetName: string): DateRange => {
    const preset = PRESETS.find(({ name }) => name === presetName)
    if (!preset) throw new Error(`Unknown date range preset: ${presetName}`)
    const from = new Date()
    const to = new Date()
    const first = from.getDate() - from.getDay()

    switch (preset.name) {
      case "today":
        from.setHours(0, 0, 0, 0)
        to.setHours(23, 59, 59, 999)
        break
      case "yesterday":
        from.setDate(from.getDate() - 1)
        from.setHours(0, 0, 0, 0)
        to.setDate(to.getDate() - 1)
        to.setHours(23, 59, 59, 999)
        break
      case "last7":
        from.setDate(from.getDate() - 6)
        from.setHours(0, 0, 0, 0)
        to.setHours(23, 59, 59, 999)
        break
      case "last14":
        from.setDate(from.getDate() - 13)
        from.setHours(0, 0, 0, 0)
        to.setHours(23, 59, 59, 999)
        break
      case "last30":
        from.setDate(from.getDate() - 29)
        from.setHours(0, 0, 0, 0)
        to.setHours(23, 59, 59, 999)
        break
      case "thisWeek":
        from.setDate(first)
        from.setHours(0, 0, 0, 0)
        to.setHours(23, 59, 59, 999)
        break
      case "lastWeek":
        from.setDate(from.getDate() - 7 - from.getDay())
        to.setDate(to.getDate() - to.getDay() - 1)
        from.setHours(0, 0, 0, 0)
        to.setHours(23, 59, 59, 999)
        break
      case "thisMonth":
        from.setDate(1)
        from.setHours(0, 0, 0, 0)
        to.setHours(23, 59, 59, 999)
        break
      case "lastMonth":
        from.setMonth(from.getMonth() - 1)
        from.setDate(1)
        from.setHours(0, 0, 0, 0)
        to.setDate(0)
        to.setHours(23, 59, 59, 999)
        break
    }

    return { from, to }
  }

  const setPreset = (preset: string): void => {
    const range = getPresetRange(preset)
    performUpdateWithRangeArg(range)
    setRange(range)
    if (rangeCompare) {
      const rangeCompare = {
        from: new Date(range.from.getFullYear() - 1, range.from.getMonth(), range.from.getDate()),
        to: range.to ? new Date(range.to.getFullYear() - 1, range.to.getMonth(), range.to.getDate()) : undefined,
      }
      setRangeCompare(rangeCompare)
    }
  }

  const checkPreset = (): void => {
    for (const preset of PRESETS) {
      const presetRange = getPresetRange(preset.name)

      const normalizedRangeFrom = new Date(range.from.setHours(0, 0, 0, 0))
      const normalizedPresetFrom = new Date(presetRange.from.setHours(0, 0, 0, 0))

      const normalizedRangeTo = new Date(range.to?.setHours(0, 0, 0, 0) ?? 0)
      const normalizedPresetTo = new Date(presetRange.to?.setHours(0, 0, 0, 0) ?? 0)

      if (normalizedRangeFrom.getTime() === normalizedPresetFrom.getTime() && normalizedRangeTo.getTime() === normalizedPresetTo.getTime()) {
        setSelectedPreset(preset.name)
        return
      }
    }

    setSelectedPreset(undefined)
  }

  const resetValues = (): void => {
    setRange({
      from: typeof initialDateFrom === "string" ? new Date(initialDateFrom) : initialDateFrom,
      to: initialDateTo
        ? typeof initialDateTo === "string"
          ? new Date(initialDateTo)
          : initialDateTo
        : typeof initialDateFrom === "string"
          ? new Date(initialDateFrom)
          : initialDateFrom,
    })
    setRangeCompare(
      initialCompareFrom
        ? {
            from: typeof initialCompareFrom === "string" ? new Date(initialCompareFrom) : initialCompareFrom,
            to: initialCompareTo
              ? typeof initialCompareTo === "string"
                ? new Date(initialCompareTo)
                : initialCompareTo
              : typeof initialCompareFrom === "string"
                ? new Date(initialCompareFrom)
                : initialCompareFrom,
          }
        : undefined,
    )
    performUpdate()
  }

  useEffect(() => {
    checkPreset()
  }, [range])
  useEffect(() => {
    if (range?.to) {
      if (range.to.getHours() === 23 && range.to.getMinutes() === 59 && range.to.getSeconds() === 59 && range.to.getMilliseconds() === 999) {
        const to = range.to
        to.setHours(23, 59, 59, 999)
        setRange((prevRange) => ({ ...prevRange, to }))
      }
    }
  }, [range.to])

  const PresetButton = ({ preset, label, isSelected }: { preset: string; label: string; isSelected: boolean }): JSX.Element => (
    <Button
      className={cn(isSelected && "pointer-events-none")}
      variant="ghost"
      onClick={() => {
        setPreset(preset)
      }}
    >
      <>
        <span className={cn("pr-2 opacity-0", isSelected && "opacity-70")}>
          <CheckIcon width={18} height={18} className="text-slate-8" />
        </span>
        {label}
      </>
    </Button>
  )

  const areRangesEqual = (a?: DateRange, b?: DateRange) => {
    if (!a || !b) return a === b // If either is undefined, return true if both are undefined
    return a.from.getTime() === b.from.getTime() && (!a.to || !b.to || a.to.getTime() === b.to.getTime())
  }

  useEffect(() => {
    if (isOpen) {
      openedRangeRef.current = range
      openedRangeCompareRef.current = rangeCompare
    }
  }, [isOpen, range, rangeCompare])

  return (
    <Popover
      modal={true}
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) {
          resetValues()
        }
        setIsOpen(open)
      }}
    >
      <PopoverTrigger asChild>
        <Button className="rt-reset rt-SelectTrigger rt-r-size-3 rt-variant-surface w-auto max-w-full overflow-clip text-sm text-slate-12">
          <div className="text-right">
            <div className="whitespace-nowrap py-1 font-normal">
              {`${formatDate(range.from, locale)}${range.to != null ? " - " + formatDate(range.to, locale) : ""}`}
            </div>
            {rangeCompare != null && (
              <div className="-mt-1 text-xs opacity-60">
                <>
                  vs. {formatDate(rangeCompare.from, locale)}
                  {rangeCompare.to != null ? ` - ${formatDate(rangeCompare.to, locale)}` : ""}
                </>
              </div>
            )}
          </div>
          <div className="-mr-2 scale-125 pl-1 opacity-60">{isOpen ? <ChevronUpIcon width={24} /> : <ChevronDownIcon width={24} />}</div>
        </Button>
      </PopoverTrigger>
      <PopoverContent align={align} className="w-auto bg-white dark:bg-gray-1">
        <div className="flex py-2">
          <div className="flex">
            <div className="flex flex-col">
              <div className="flex flex-col items-center justify-end gap-2 px-3 pb-4 lg:flex-row lg:items-start lg:pb-0">
                <div className="flex items-center space-x-2 py-1 pr-4">
                  {showCompare && (
                    <Switch
                      defaultChecked={Boolean(rangeCompare)}
                      onCheckedChange={(checked: boolean) => {
                        if (checked) {
                          if (!range.to) {
                            setRange({
                              from: range.from,
                              to: range.from,
                            })
                          }
                          setRangeCompare({
                            from: new Date(range.from.getFullYear(), range.from.getMonth(), range.from.getDate() - 365),
                            to: range.to
                              ? new Date(range.to.getFullYear() - 1, range.to.getMonth(), range.to.getDate())
                              : new Date(range.from.getFullYear() - 1, range.from.getMonth(), range.from.getDate()),
                          })
                          performUpdate()
                        } else {
                          setRangeCompare(undefined)
                        }
                      }}
                      id="compare-mode"
                    />
                  )}
                  <Label htmlFor="compare-mode">Compare</Label>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <DateInput
                      value={range.from}
                      onChange={(date) => {
                        const toDate = range.to == null || date > range.to ? date : range.to
                        setRange((prevRange) => ({
                          ...prevRange,
                          from: date,
                          to: toDate,
                        }))
                        performUpdate()
                      }}
                    />
                    <div className="py-1">-</div>
                    <DateInput
                      value={range.to}
                      onChange={(date) => {
                        const fromDate = date < range.from ? date : range.from
                        setRange((prevRange) => ({
                          ...prevRange,
                          from: fromDate,
                          to: date,
                        }))
                        performUpdate()
                      }}
                    />
                  </div>
                  {rangeCompare != null && (
                    <div className="flex gap-2">
                      <DateInput
                        value={rangeCompare?.from}
                        onChange={(date) => {
                          if (rangeCompare) {
                            const compareToDate = rangeCompare.to == null || date > rangeCompare.to ? date : rangeCompare.to
                            setRangeCompare((prevRangeCompare) => ({
                              ...prevRangeCompare,
                              from: date,
                              to: compareToDate,
                            }))
                          } else {
                            setRangeCompare({
                              from: date,
                              to: new Date(),
                            })
                          }
                        }}
                      />
                      <div className="py-1">-</div>
                      <DateInput
                        value={rangeCompare?.to}
                        onChange={(date) => {
                          if (rangeCompare && rangeCompare.from) {
                            const compareFromDate = date < rangeCompare.from ? date : rangeCompare.from
                            setRangeCompare({
                              ...rangeCompare,
                              from: compareFromDate,
                              to: date,
                            })
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              {isSmallScreen && (
                <Select
                  defaultValue={selectedPreset}
                  onValueChange={(value) => {
                    setPreset(value)
                  }}
                >
                  <SelectTrigger className="mx-auto mb-2 w-[180px]">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {PRESETS.map((preset) => (
                      <SelectItem key={preset.name} value={preset.name}>
                        {preset.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <div>
                <Calendar
                  mode="range"
                  onSelect={(value: { from?: Date; to?: Date } | undefined) => {
                    if (value?.from != null) {
                      setRange({ from: value.from, to: value?.to })
                      performUpdate()
                    }
                  }}
                  selected={range}
                  numberOfMonths={isSmallScreen ? 1 : 2}
                  defaultMonth={new Date(new Date().setMonth(new Date().getMonth() - (isSmallScreen ? 0 : 1)))}
                />
              </div>
            </div>
          </div>
          {!isSmallScreen && (
            <div className="flex flex-col items-end gap-1 pb-6 pl-6 pr-2">
              <div className="flex w-full flex-col items-end gap-1 pb-6 pl-6 pr-2">
                {PRESETS.map((preset) => (
                  <PresetButton key={preset.name} preset={preset.name} label={preset.label} isSelected={selectedPreset === preset.name} />
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 py-2 pr-4">
          <Button
            className="bg-black text-white hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-100"
            onClick={() => {
              setIsOpen(false)
              resetValues()
            }}
          >
            Cancel
          </Button>
          <Button
            className="bg-black text-white hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-100"
            onClick={() => {
              setIsOpen(false)
              performUpdateWithRangeArg(range)
            }}
          >
            Update
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

DateRangePicker.displayName = "DateRangePicker"
DateRangePicker.filePath = "libs/shared/ui-kit/src/lib/date-range-picker/date-range-picker.tsx"
