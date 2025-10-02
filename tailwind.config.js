/** @type {import('tailwindcss').Config} */
// Penn State-inspired professional theme colors
// Design Decision: Navy (#041E42) as primary brand color reflects academic authority
// while maintaining professional consulting credibility. Light backgrounds provide
// clean, accessible reading experience for academic and business contexts.
const themeColors = {
  brand: {
    primary: '#041E42',      // Penn State Navy - Main brand color, headers, primary CTAs
    secondary: '#FFFFFF',    // White - Secondary buttons, contrast elements
    accent: '#EDEDED',       // Light Gray - Accent elements, subtle highlights
  },
  text: {
    primary: '#041E42',      // Navy blue - Main text, headings (professional tone)
    secondary: '#6B7280',    // Medium gray - Muted text, descriptions
    muted: '#9CA3AF',        // Light gray - Disabled text, placeholders
    inverse: '#FFFFFF',      // White - Text on dark backgrounds
  },
  background: {
    primary: '#FFFFFF',      // White - Main page background (clean, academic)
    secondary: '#F9FAFB',    // Very light gray - Card backgrounds, panels
    tertiary: '#EDEDED',     // Light gray - Secondary panels, elevated surfaces
    elevated: '#F3F4F6',     // Slightly darker light gray - Dropdowns, tooltips
  },
  border: {
    primary: '#E5E7EB',      // Light gray - Default borders, dividers
    secondary: '#D1D5DB',    // Medium gray - Stronger borders, focus states
    muted: '#F3F4F6',        // Very light gray - Subtle separators
    focus: '#041E42',        // Navy focus - Focus rings and active borders
  },
  status: {
    success: '#059669',      // Emerald green - Success messages
    warning: '#D97706',      // Amber - Warnings
    error: '#DC2626',        // Red - Errors
    info: '#2563EB',         // Blue - Information
    successMuted: '#ECFDF5', // Light green background
    warningMuted: '#FFFBEB', // Light amber background
    errorMuted: '#FEF2F2',   // Light red background
    infoMuted: '#EFF6FF',    // Light blue background
  },
  interactive: {
    hover: '#1E40AF',        // Darker blue - Hover states for navy elements
    active: '#1E3A8A',       // Even darker blue - Active/pressed states
    disabled: '#9CA3AF',     // Light gray - Disabled elements
    focus: '#041E42',        // Navy focus - Focus ring color
    glow: '#041E4220',       // Navy with opacity - Subtle glow effects
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

      // Typography - Professional serif/sans-serif pairing
      // Design Decision: Merriweather serif for headings creates academic authority,
      // while Inter sans-serif ensures excellent readability for body text and UI elements.
      // This pairing balances scholarly credibility with modern accessibility standards.
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'SFMono-Regular', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
        display: ['Merriweather', 'Georgia', 'serif'], // Serif headings for academic feel
      },

      // Shadows - light theme with professional depth
      boxShadow: {
        soft: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        brand: '0 10px 15px -3px rgba(4, 30, 66, 0.1), 0 4px 6px -2px rgba(4, 30, 66, 0.05)',
        glow: '0 0 20px rgba(4, 30, 66, 0.15)',
        'glow-sm': '0 0 10px rgba(4, 30, 66, 0.1)',
        'glow-md': '0 0 15px rgba(4, 30, 66, 0.15)',
        'glow-lg': '0 0 25px rgba(4, 30, 66, 0.2)',
        'glow-xl': '0 0 35px rgba(4, 30, 66, 0.25)',
        dark: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
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
          '0%': { boxShadow: '0 0 20px rgba(4, 30, 66, 0.15)' },
          '100%': { boxShadow: '0 0 30px rgba(4, 30, 66, 0.25)' },
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
