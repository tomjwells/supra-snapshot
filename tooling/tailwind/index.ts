/** @type {import('tailwindcss').Config} */
import type { Config } from "tailwindcss"

export default {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  darkMode: "class", 
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "hsl(var(--brand-default) / <alpha-value>)",
        },
        background: {
          DEFAULT: "rgb(var(--background) / <alpha-value>)", 
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
        panel: {
          DEFAULT: "hsl(var(--panel) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
      },
      textColor: {
        theme: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          blue: "var(--text-blue)",
          "blue-dark": "var(--text-blue-dark)",
          green: "var(--text-green)",
          orange: "var(--text-orange)",
          red: "var(--text-red)",
          "red-disabled": "var(--text-red-disabled)",
          purple: "var(--text-purple)",
          inverted: "var(--text-inverted)",
          menu: "var(--color-text-menu)",
          "menu-selected": "var(--color-text-menu-selected)",
        },
      },
      backgroundColor: {
        theme: {
          primary: "rgb(var(--color-bg-primary) / <alpha-value>)",
          "primary-hover": "var(--color-bg-primary-hover)",
          secondary: "var(--color-bg-secondary)",
          green: "var(--bg-green)",
          "green-light": "var(--bg-green-light)",
          purple: "var(--bg-purple)",
          "purple-secondary": "var(--bg-purple-secondary)",
          "purple-tertiary": "var(--bg-purple-tertiary)",
          inverted: "var(--color-bg-inverted)",
          btn: {
            primary: "var(--color-btn-primary)",
            secondary: "var(--color-btn-secondary)",
            inverted: "var(--color-btn-inverted)",
          },
        },
      },
      borderColor: {
        theme: {
          primary: "var(--border-primary)",
          secondary: "var(--border-secondary)",
          green: "var(--border-green)",
          "green-light": "var(--border-green-light)",
        },
      },
      ringColor: {
        theme: {
          primary: "var(--color-ring-primary)",
        },
      },
      keyframes: {
        slideDown: {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        slideUp: {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        // Navigation menu
        enterFromRight: {
          from: { opacity: "0", transform: "translateX(200px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        enterFromLeft: {
          from: { opacity: "0", transform: "translateX(-200px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        exitToRight: {
          from: { opacity: "1", transform: "translateX(0)" },
          to: { opacity: "0", transform: "translateX(200px)" },
        },
        exitToLeft: {
          from: { opacity: "1", transform: "translateX(0)" },
          to: { opacity: "0", transform: "translateX(-200px)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "rotateX(-10deg) scale(0.9)" },
          to: { opacity: "1", transform: "rotateX(0deg) scale(1)" },
        },
        scaleOut: {
          from: { opacity: "1", transform: "rotateX(0deg) scale(1)" },
          to: { opacity: "0", transform: "rotateX(-10deg) scale(0.95)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        fadeOut: {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
      },
      animation: {
        // Accordion
        slideDown: "slideDown 150ms cubic-bezier(0.87, 0, 0.13, 1)",
        slideUp: "slideUp 150ms cubic-bezier(0.87, 0, 0.13, 1)",
        // Navigation Menu
        scaleIn: "scaleIn 200ms ease",
        scaleOut: "scaleOut 200ms ease",
        fadeIn: "fadeIn 200ms ease",
        fadeOut: "fadeOut 200ms ease",
        enterFromLeft: "enterFromLeft 250ms ease",
        enterFromRight: "enterFromRight 250ms ease",
        exitToLeft: "exitToLeft 250ms ease",
        exitToRight: "exitToRight 250ms ease",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms"), require("windy-radix-palette"), require("windy-radix-typography")],
} satisfies Config
