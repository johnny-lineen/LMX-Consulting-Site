/** @type {import('tailwindcss').Config} */
// Dark IBM-inspired theme colors
const themeColors = {
  brand: {
    primary: '#00E5FF',      // Teal/Aqua - Main CTA buttons, charts, highlights
    secondary: '#2979FF',    // Cyan/Blue - Secondary buttons, subtle callouts
    accent: '#14F1D9',       // Alternative teal - Special highlights and accents
  },
  text: {
    primary: '#FFFFFF',      // Pure white - Main text, headings
    secondary: '#B0B0B0',    // Light gray - Muted text, descriptions
    muted: '#6E6E6E',        // Darker gray - Disabled text, placeholders
    inverse: '#121212',      // Deep black - Text on light backgrounds (rare)
  },
  background: {
    primary: '#121212',      // Deep black - Main page background
    secondary: '#1C1C1E',    // Dark charcoal - Card backgrounds, panels
    tertiary: '#2A2A2E',     // Secondary panel - Elevated surfaces, modals
    elevated: '#333338',     // Higher elevation - Dropdowns, tooltips
  },
  border: {
    primary: '#2E2E2E',      // Subtle lines - Default borders, dividers
    secondary: '#404040',    // Stronger borders - Focus states, emphasis
    muted: '#1A1A1A',        // Very subtle - Light separators
    focus: '#00E5FF',        // Teal focus - Focus rings and active borders
  },
  status: {
    success: '#00FF95',      // Neon green - Success messages
    warning: '#FFB74D',      // Amber - Warnings
    error: '#FF5252',        // Crimson - Errors
    info: '#2979FF',         // Cyan blue - Information
    successMuted: '#0A2F1F', // Dark green background
    warningMuted: '#2F2416', // Dark amber background
    errorMuted: '#2F1616',   // Dark red background
    infoMuted: '#16202F',    // Dark blue background
  },
  interactive: {
    hover: '#00B8CC',        // Darker teal - Hover states
    active: '#009FB3',       // Even darker teal - Active/pressed states
    disabled: '#404040',     // Dark gray - Disabled elements
    focus: '#00E5FF',        // Bright teal - Focus ring color
    glow: '#00E5FF40',       // Teal with opacity - Glow effects
  }
}

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Brand Colors - semantic naming for consistent theming
      colors: {
        // Legacy support - map old names to new theme structure
        primary: themeColors.brand.primary,
        secondary: themeColors.brand.secondary,
        accent: themeColors.brand.accent,
        muted: themeColors.text.secondary,
        foreground: themeColors.text.primary,
        background: themeColors.background.primary,

        // New semantic color system - dark theme
        brand: themeColors.brand,
        text: themeColors.text,
        bg: themeColors.background,
        border: themeColors.border,
        status: themeColors.status,
        interactive: themeColors.interactive,
      },

      // Typography - IBM-inspired fonts
      fontFamily: {
        sans: ['Inter', 'IBM Plex Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
        mono: ['IBM Plex Mono', 'JetBrains Mono', 'Fira Code', 'ui-monospace', 'SFMono-Regular', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
        display: ['Inter', 'IBM Plex Sans', 'system-ui', 'sans-serif'],
      },

      // Shadows - dark theme with glow effects
      boxShadow: {
        soft: '0 10px 30px rgba(0,0,0,0.3)',
        brand: '0 10px 30px rgba(0, 229, 255, 0.15)',
        glow: '0 0 20px rgba(0, 229, 255, 0.3)',
        'glow-sm': '0 0 10px rgba(0, 229, 255, 0.3)',
        'glow-md': '0 0 20px rgba(0, 229, 255, 0.4)',
        'glow-lg': '0 0 30px rgba(0, 229, 255, 0.5)',
        'glow-xl': '0 0 40px rgba(0, 229, 255, 0.6)',
        dark: '0 10px 30px rgba(0,0,0,0.5)',
      },

      // Border Radius
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },

      // Animation
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite alternate',
        'fade-in': 'fade-in 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
      },

      // Keyframes for animations
      keyframes: {
        'glow-pulse': {
          '0%': { boxShadow: '0 0 20px rgba(0, 229, 255, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(0, 229, 255, 0.6)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
