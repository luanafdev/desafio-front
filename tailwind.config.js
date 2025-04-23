import {heroui} from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
        poppins: ['Poppins', 'sans-serif'],
        eater: ['Eater', 'cursive'],
        dela: ['var(--font-dela-gothic-one)', 'cursive'],
        dm: ['DM Serif Display', 'cursive']
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
}

module.exports = config;