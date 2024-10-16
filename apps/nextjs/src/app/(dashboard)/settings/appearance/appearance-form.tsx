"use client"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@acme/shadcn/form"
import { RadioGroup, RadioGroupItem } from "@acme/shadcn/radio-group"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTheme } from "next-themes"
import { useForm } from "react-hook-form"
import * as z from "zod"

const appearanceFormSchema = z.object({
  theme: z.enum(["light", "dark"], {
    required_error: "Please select a theme.",
  }),
  font: z.enum(["inter", "manrope", "system"], {
    invalid_type_error: "Select a font",
    required_error: "Please select a font.",
  }),
})

type AppearanceFormValues = z.infer<typeof appearanceFormSchema>

// This can come from your database or API.
const defaultValues: Partial<AppearanceFormValues> = {
  theme: "light",
}

export function AppearanceForm() {
  const { setTheme } = useTheme()

  const form = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues,
  })

  return (
    <Form {...form} className="space-y-8">
      <FormField
        control={form.control}
        name="theme"
        render={({ field }) => (
          <FormItem className="space-y-1">
            <FormLabel>Theme</FormLabel>
            <FormDescription>Select the theme for the dashboard.</FormDescription>
            <FormMessage />
            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid max-w-md grid-cols-2 gap-8 pt-2">
              <FormItem onSelect={() => setTheme("light")}>
                <FormLabel className="[&:has([data-state=checked])>div]:border-gray-12">
                  <FormControl>
                    <RadioGroupItem value="light" className="sr-only" onClick={() => setTheme("light")} />
                  </FormControl>
                  <div className="light flex items-end justify-center rounded-md border border-green-500 bg-zinc-50 px-1.5 pt-3">
                    <LightThemePreview />
                  </div>
                  <span className="block w-full p-2 text-center font-normal">Light</span>
                </FormLabel>
              </FormItem>
              <FormItem>
                <FormLabel className="[&:has([data-state=checked])>div]:border-gray-12">
                  <FormControl>
                    <RadioGroupItem value="dark" className="sr-only" onClick={() => setTheme("dark")} />
                  </FormControl>
                  <div className="dark flex items-end justify-center rounded-md border  border-muted bg-zinc-900 p-1 px-1.5 pt-3 hover:border-accent">
                    <DarkThemePreview />
                  </div>
                  <span className="block w-full p-2 text-center font-normal">Dark</span>
                </FormLabel>
              </FormItem>
            </RadioGroup>
          </FormItem>
        )}
      />
    </Form>
  )
}

function DarkThemePreview() {
  return (
    <span className="block h-full w-full overflow-hidden">
      <span className="block rounded-t-sm border border-b-0 border-zinc-700 shadow-xl shadow-black/95">
        <svg width="177" height="100%" viewBox="0 0 177 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="max-w-full" aria-hidden="true">
          <g clipPath="url(#clip0_77_16__xTQiD87C)">
            <rect width="177" height="162" rx="3" fill="#171717"></rect>
            <g filter="url(#filter0_d_77_16__xTQiD87C)">
              <path d="M44 0H174C175.657 0 177 1.34315 177 3V151H44V0Z" fill="#262626"></path>
            </g>
            <circle cx="35" cy="8" r="4" fill="#525252"></circle>
            <circle cx="73" cy="40" r="4" fill="#525252"></circle>
            <rect x="5" y="5" width="22" height="6" rx="1" fill="#404040"></rect>
            <rect x="5" y="16" width="34" height="6" rx="1" fill="#171717"></rect>
            <rect x="5.5" y="16.5" width="33" height="5" rx="0.5" stroke="white" strokeOpacity="0.12"></rect>
            <rect x="5" y="26" width="34" height="6" rx="1" fill="#404040"></rect>
            <rect x="81" y="37" width="13" height="2" rx="1" fill="#A3A3A3"></rect>
            <rect x="96" y="37" width="19" height="2" rx="1" fill="#A3A3A3"></rect>
            <rect x="81" y="42" width="8" height="2" rx="1" fill="#525252"></rect>
            <rect x="91" y="42" width="15" height="2" rx="1" fill="#525252"></rect>
            <rect x="108" y="42" width="6" height="2" rx="1" fill="#525252"></rect>
            <rect x="116" y="42" width="12" height="2" rx="1" fill="#525252"></rect>
            <rect x="130" y="42" width="9" height="2" rx="1" fill="#525252"></rect>
            <rect x="69" y="47" width="8" height="2" rx="1" fill="#525252"></rect>
            <rect x="79" y="47" width="2" height="2" rx="1" fill="#525252"></rect>
            <rect x="83" y="47" width="9" height="2" rx="1" fill="#525252"></rect>
            <rect x="94" y="47" width="16" height="2" rx="1" fill="#525252"></rect>
            <rect x="112" y="47" width="7" height="2" rx="1" fill="#525252"></rect>
            <rect x="121" y="47" width="3" height="2" rx="1" fill="#525252"></rect>
            <rect x="126" y="47" width="9" height="2" rx="1" fill="#525252"></rect>
            <rect x="137" y="47" width="4" height="2" rx="1" fill="#525252"></rect>
            <rect x="143" y="47" width="6" height="2" rx="1" fill="#525252"></rect>
            <rect x="5" y="36" width="34" height="6" rx="1" fill="#262626"></rect>
            <rect x="5" y="46" width="34" height="6" rx="1" fill="#262626"></rect>
            <rect x="5" y="56" width="34" height="6" rx="1" fill="#262626"></rect>
            <rect x="69" y="53" width="84" height="47" rx="4" fill="#404040"></rect>
            <rect width="177" height="140" fill="url(#paint0_linear_77_16__xTQiD87C)" fillOpacity="0.32"></rect>
          </g>
          <defs>
            <filter id="filter0_d_77_16__xTQiD87C" x="43" y="0" width="134" height="151" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
              <feOffset dx="-1"></feOffset>
              <feComposite in2="hardAlpha" operator="out"></feComposite>
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"></feColorMatrix>
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_77_16"></feBlend>
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_77_16" result="shape"></feBlend>
            </filter>
            <linearGradient id="paint0_linear_77_16__xTQiD87C" x1="88.5" y1="0" x2="88.5" y2="140" gradientUnits="userSpaceOnUse">
              <stop offset="0.565789" stopOpacity="0"></stop>
              <stop offset="1"></stop>
            </linearGradient>
            <clipPath id="clip0_77_16__xTQiD87C">
              <rect width="177" height="140" fill="white"></rect>
            </clipPath>
          </defs>
        </svg>
      </span>
    </span>
  )
}

function LightThemePreview() {
  return (
    <span className="block h-full w-full overflow-hidden">
      <span className="block rounded-t-sm border border-b-0 shadow-xl shadow-black/20">
        <svg width="177" height="100%" viewBox="0 0 177 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="max-w-full" aria-hidden="true">
          <g clipPath="url(#clip0_77_15__SYUITjsj)">
            <rect width="177" height="162" rx="3" fill="white"></rect>
            <rect x="-0.5" y="-0.5" width="178" height="163" rx="3.5" stroke="black" strokeOpacity="0.01"></rect>
            <g filter="url(#filter0_d_77_15__SYUITjsj)">
              <path d="M44 0H174C175.657 0 177 1.34315 177 3V151H44V0Z" fill="#FAFAFA"></path>
            </g>
            <circle cx="35" cy="8" r="4" fill="#D4D4D4"></circle>
            <circle cx="73" cy="40" r="4" fill="#D4D4D4"></circle>
            <rect x="5" y="5" width="22" height="6" rx="1" fill="#E5E5E5"></rect>
            <rect x="5" y="16" width="34" height="6" rx="1" fill="white"></rect>
            <rect x="5.5" y="16.5" width="33" height="5" rx="0.5" stroke="black" strokeOpacity="0.08"></rect>
            <rect x="5" y="26" width="34" height="6" rx="1" fill="#E5E5E5"></rect>
            <rect x="81" y="37" width="13" height="2" rx="1" fill="#A3A3A3"></rect>
            <rect x="96" y="37" width="19" height="2" rx="1" fill="#A3A3A3"></rect>
            <rect x="81" y="42" width="8" height="2" rx="1" fill="#E5E5E5"></rect>
            <rect x="91" y="42" width="15" height="2" rx="1" fill="#E5E5E5"></rect>
            <rect x="108" y="42" width="6" height="2" rx="1" fill="#E5E5E5"></rect>
            <rect x="116" y="42" width="12" height="2" rx="1" fill="#E5E5E5"></rect>
            <rect x="130" y="42" width="9" height="2" rx="1" fill="#E5E5E5"></rect>
            <rect x="69" y="47" width="8" height="2" rx="1" fill="#E5E5E5"></rect>
            <rect x="79" y="47" width="2" height="2" rx="1" fill="#E5E5E5"></rect>
            <rect x="83" y="47" width="9" height="2" rx="1" fill="#E5E5E5"></rect>
            <rect x="94" y="47" width="16" height="2" rx="1" fill="#E5E5E5"></rect>
            <rect x="112" y="47" width="7" height="2" rx="1" fill="#E5E5E5"></rect>
            <rect x="121" y="47" width="3" height="2" rx="1" fill="#E5E5E5"></rect>
            <rect x="126" y="47" width="9" height="2" rx="1" fill="#E5E5E5"></rect>
            <rect x="137" y="47" width="4" height="2" rx="1" fill="#E5E5E5"></rect>
            <rect x="143" y="47" width="6" height="2" rx="1" fill="#E5E5E5"></rect>
            <rect x="5" y="36" width="34" height="6" rx="1" fill="#F5F5F5"></rect>
            <rect x="5" y="46" width="34" height="6" rx="1" fill="#F5F5F5"></rect>
            <rect x="5" y="56" width="34" height="6" rx="1" fill="#F5F5F5"></rect>
            <rect x="69" y="53" width="84" height="47" rx="4" fill="#E5E5E5"></rect>
            <rect width="177" height="140" fill="url(#paint0_linear_77_15__SYUITjsj)" fillOpacity="0.04"></rect>
          </g>
          <defs>
            <filter id="filter0_d_77_15__SYUITjsj" x="43" y="0" width="134" height="151" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
              <feOffset dx="-1"></feOffset>
              <feComposite in2="hardAlpha" operator="out"></feComposite>
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"></feColorMatrix>
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_77_15"></feBlend>
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_77_15" result="shape"></feBlend>
            </filter>
            <linearGradient id="paint0_linear_77_15__SYUITjsj" x1="88.5" y1="0" x2="88.5" y2="140" gradientUnits="userSpaceOnUse">
              <stop offset="0.565789" stopOpacity="0"></stop>
              <stop offset="1"></stop>
            </linearGradient>
            <clipPath id="clip0_77_15__SYUITjsj">
              <rect width="177" height="140" fill="white"></rect>
            </clipPath>
          </defs>
        </svg>
      </span>
    </span>
  )
}
