/** @type {import('tailwindcss').Config} */
const brand = require('./src/lib/brand.js')
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: brand.colors.primary,
        secondary: brand.colors.secondary,
        accent: brand.colors.accent,
        muted: brand.colors.muted,
        foreground: brand.colors.foreground,
        background: brand.colors.background,
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol']
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0,0,0,0.07)'
      },
      borderRadius: {
        '2xl': '1rem'
      }
    },
  },
  plugins: [],
}
