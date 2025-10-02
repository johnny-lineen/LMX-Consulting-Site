/**
 * 🎨 CENTRALIZED THEME CONFIGURATION
 * 
 * This is the single source of truth for all brand colors, typography, spacing,
 * and design tokens used throughout the LMX Consulting application.
 * 
 * 🚀 QUICK START:
 * 1. Update brand colors below to change the entire site's color scheme
 * 2. Modify typography settings to change fonts and text styles
 * 3. Adjust spacing values for consistent layout patterns
 * 4. Use themeUtils.ts helper functions for component styling
 * 
 * 📖 USAGE EXAMPLES:
 * 
 * In Components:
 * ```tsx
 * import { createButtonClass, createCardClass } from '@/lib/themeUtils'
 * 
 * // Create a primary button
 * <button className={createButtonClass('primary', 'lg')}>Click me</button>
 * 
 * // Create a card with shadow
 * <div className={createCardClass({ shadow: 'lg', padding: 'md' })}>Content</div>
 * ```
 * 
 * Direct Theme Access:
 * ```tsx
 * import { theme } from '@/lib/theme'
 * 
 * // Use theme colors directly
 * <div style={{ color: theme.colors.brand.primary }}>Text</div>
 * ```
 * 
 * Tailwind Classes (automatically available):
 * ```tsx
 * // These classes are generated from the theme
 * <div className="bg-brand-primary text-text-inverse">
 * <p className="text-text-secondary">
 * <button className="bg-status-success">
 * ```
 * 
 * 🎯 CUSTOMIZATION GUIDE:
 * 
 * To change the primary brand color:
 * 1. Update colors.brand.primary below
 * 2. The change will automatically apply to:
 *    - All buttons with variant="primary"
 *    - Links and interactive elements
 *    - Focus states and highlights
 *    - Tailwind classes like 'bg-brand-primary'
 * 
 * To add a new color:
 * 1. Add it to the appropriate color category below
 * 2. Update tailwind.config.js to include the new color
 * 3. Use it in components via theme or Tailwind classes
 * 
 * 🔧 MAINTENANCE:
 * - Always use semantic names (brand.primary vs #4F46E5)
 * - Test changes across all components before deploying
 * - Keep this file as the single source of truth
 * - Document any breaking changes in component updates
 */

// ============================================================================
// BRAND CONFIGURATION
// ============================================================================

export interface NavItem {
  label: string;
  href: string;
}

export interface BrandConfig {
  name: string;
  tagline: string;
  nav: NavItem[];
}

export const brand: BrandConfig = {
  name: "LMX Consulting",
  tagline: "Harness AI to save 10+ hours/week in Microsoft 365",
  nav: [
    { label: "Home", href: "/" },
    { label: "Consultation", href: "/consultation" },
    { label: "Resources", href: "/resources" },
    { label: "Bot", href: "/bot" },
  ],
};

// ============================================================================
// BRAND COLORS
// ============================================================================

export const colors = {
  // Primary brand colors - IBM-inspired dark theme
  brand: {
    primary: '#00E5FF',      // Teal/Aqua - Main CTA buttons, charts, highlights, active states
    secondary: '#2979FF',    // Cyan/Blue - Secondary buttons, subtle callouts
    accent: '#14F1D9',       // Alternative teal - Special highlights and accents
  },

  // Text colors - optimized for dark backgrounds
  text: {
    primary: '#FFFFFF',      // Pure white - Main text, headings
    secondary: '#B0B0B0',    // Light gray - Muted text, descriptions
    muted: '#6E6E6E',        // Darker gray - Disabled text, placeholders
    inverse: '#121212',      // Deep black - Text on light backgrounds (rare)
  },

  // Background colors - dark IBM-inspired palette
  background: {
    primary: '#121212',      // Deep black - Main page background
    secondary: '#1C1C1E',    // Dark charcoal - Card backgrounds, panels
    tertiary: '#2A2A2E',     // Secondary panel - Elevated surfaces, modals
    elevated: '#333338',     // Higher elevation - Dropdowns, tooltips
  },

  // Border colors - subtle dark theme borders
  border: {
    primary: '#2E2E2E',      // Subtle lines - Default borders, dividers
    secondary: '#404040',    // Stronger borders - Focus states, emphasis
    muted: '#1A1A1A',        // Very subtle - Light separators
    focus: '#00E5FF',        // Teal focus - Focus rings and active borders
  },

  // Status colors - muted with neon highlights
  status: {
    success: '#00FF95',      // Neon green - Success messages, positive actions
    warning: '#FFB74D',      // Amber - Warnings, caution states
    error: '#FF5252',        // Crimson - Errors, destructive actions
    info: '#2979FF',         // Cyan blue - Information, neutral alerts
    
    // Muted versions for backgrounds
    successMuted: '#0A2F1F', // Dark green background
    warningMuted: '#2F2416', // Dark amber background
    errorMuted: '#2F1616',   // Dark red background
    infoMuted: '#16202F',    // Dark blue background
  },

  // Interactive states - with glow effects
  interactive: {
    hover: '#00B8CC',        // Darker teal - Hover states for primary elements
    active: '#009FB3',       // Even darker teal - Active/pressed states
    disabled: '#404040',     // Dark gray - Disabled elements
    focus: '#00E5FF',        // Bright teal - Focus ring color
    glow: '#00E5FF40',       // Teal with opacity - Glow effects
  },

  // Gradient combinations - dark theme gradients
  gradients: {
    primary: 'from-teal-400 to-cyan-400',        // Main brand gradient
    secondary: 'from-blue-500 to-cyan-500',      // Secondary gradient
    success: 'from-green-400 to-emerald-400',    // Success gradient
    dark: 'from-gray-900 to-black',              // Dark background gradient
    glow: 'from-teal-400/20 to-cyan-400/20',     // Subtle glow gradient
  }
} as const;

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const typography = {
  // Font families - IBM-inspired clean sans-serif
  fontFamily: {
    sans: ['Inter', 'IBM Plex Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
    mono: ['IBM Plex Mono', 'JetBrains Mono', 'Fira Code', 'ui-monospace', 'SFMono-Regular', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
    display: ['Inter', 'IBM Plex Sans', 'system-ui', 'sans-serif'], // For headings and display text
  },

  // Font sizes - semantic naming for consistent hierarchy
  fontSize: {
    // Body text sizes
    xs: '0.75rem',      // 12px - Small labels, captions
    sm: '0.875rem',     // 14px - Secondary text, descriptions
    base: '1rem',       // 16px - Default body text
    lg: '1.125rem',     // 18px - Large body text, subtitles

    // Heading sizes
    xl: '1.25rem',      // 20px - Small headings, card titles
    '2xl': '1.5rem',    // 24px - Section headings
    '3xl': '1.875rem',  // 30px - Page headings
    '4xl': '2.25rem',   // 36px - Hero headings
    '5xl': '3rem',      // 48px - Large hero text
    '6xl': '3.75rem',   // 60px - Display headings
  },

  // Font weights
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },

  // Line heights - for optimal readability
  lineHeight: {
    tight: '1.25',      // Headings
    snug: '1.375',      // Subheadings
    normal: '1.5',      // Body text
    relaxed: '1.625',   // Long-form content
    loose: '2',         // Spacious layouts
  },

  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  }
} as const;

// ============================================================================
// SPACING & SIZING
// ============================================================================

export const spacing = {
  // Base spacing scale (rem units for accessibility)
  scale: {
    0: '0',
    px: '1px',
    0.5: '0.125rem',    // 2px
    1: '0.25rem',       // 4px
    1.5: '0.375rem',    // 6px
    2: '0.5rem',        // 8px
    2.5: '0.625rem',    // 10px
    3: '0.75rem',       // 12px
    3.5: '0.875rem',    // 14px
    4: '1rem',          // 16px
    5: '1.25rem',       // 20px
    6: '1.5rem',        // 24px
    7: '1.75rem',       // 28px
    8: '2rem',          // 32px
    9: '2.25rem',       // 36px
    10: '2.5rem',       // 40px
    11: '2.75rem',      // 44px
    12: '3rem',         // 48px
    14: '3.5rem',       // 56px
    16: '4rem',         // 64px
    20: '5rem',         // 80px
    24: '6rem',         // 96px
    28: '7rem',         // 112px
    32: '8rem',         // 128px
  },

  // Semantic spacing - use these for consistent layouts
  component: {
    // Padding inside components
    padding: {
      xs: '0.5rem',     // 8px - Tight padding
      sm: '0.75rem',    // 12px - Small padding
      md: '1rem',       // 16px - Default padding
      lg: '1.5rem',     // 24px - Large padding
      xl: '2rem',       // 32px - Extra large padding
      '2xl': '3rem',    // 48px - Section padding
    },

    // Margins between components
    margin: {
      xs: '0.5rem',     // 8px - Tight margins
      sm: '1rem',       // 16px - Small margins
      md: '1.5rem',     // 24px - Default margins
      lg: '2rem',       // 32px - Large margins
      xl: '3rem',       // 48px - Extra large margins
      '2xl': '4rem',    // 64px - Section margins
    },

    // Gaps in flex/grid layouts
    gap: {
      xs: '0.5rem',     // 8px - Tight gaps
      sm: '0.75rem',    // 12px - Small gaps
      md: '1rem',       // 16px - Default gaps
      lg: '1.5rem',     // 24px - Large gaps
      xl: '2rem',       // 32px - Extra large gaps
    }
  }
} as const;

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const borderRadius = {
  none: '0',
  sm: '0.125rem',       // 2px - Subtle rounding
  base: '0.25rem',      // 4px - Default rounding
  md: '0.375rem',       // 6px - Medium rounding
  lg: '0.5rem',         // 8px - Large rounding
  xl: '0.75rem',        // 12px - Extra large rounding
  '2xl': '1rem',        // 16px - Very large rounding
  '3xl': '1.5rem',      // 24px - Extreme rounding
  full: '9999px',       // Fully rounded (pills, circles)
} as const;

// ============================================================================
// SHADOWS
// ============================================================================

export const shadows = {
  // Subtle shadows for depth
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',

  // Custom branded shadows
  soft: '0 10px 30px rgba(0,0,0,0.07)',           // Existing soft shadow
  brand: '0 10px 30px rgba(79, 70, 229, 0.15)',  // Brand-colored shadow
  glow: '0 0 20px rgba(79, 70, 229, 0.3)',       // Glow effect

  // Inner shadows
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: '0 0 #0000',
} as const;

// ============================================================================
// BREAKPOINTS
// ============================================================================

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// ============================================================================
// ANIMATION & TRANSITIONS
// ============================================================================

export const animation = {
  // Transition durations
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    glow: '200ms',
  },

  // Easing functions
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  // Common transition combinations
  transition: {
    colors: 'color 150ms ease-in-out, background-color 150ms ease-in-out, border-color 150ms ease-in-out',
    transform: 'transform 300ms ease-in-out',
    all: 'all 300ms ease-in-out',
    glow: 'box-shadow 200ms ease-in-out, border-color 200ms ease-in-out',
    scale: 'transform 200ms ease-out, box-shadow 200ms ease-out',
  },

  // Glow effects for dark theme
  glow: {
    sm: '0 0 10px rgba(0, 229, 255, 0.3)',
    md: '0 0 20px rgba(0, 229, 255, 0.4)',
    lg: '0 0 30px rgba(0, 229, 255, 0.5)',
    xl: '0 0 40px rgba(0, 229, 255, 0.6)',
  }
} as const;

// ============================================================================
// COMPONENT VARIANTS
// ============================================================================

export const components = {
  // Button variants - dark theme with glow effects
  button: {
    // Size variants
    size: {
      xs: 'px-2.5 py-1.5 text-xs',
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-5 py-3 text-base',
      xl: 'px-6 py-3.5 text-lg',
    },

    // Style variants - dark theme optimized
    variant: {
      primary: 'bg-brand-primary text-background-primary hover:bg-interactive-hover hover:shadow-glow-md transition-glow font-medium',
      secondary: 'border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-background-primary hover:shadow-glow-sm transition-glow',
      outline: 'border border-border-primary text-text-primary hover:border-brand-primary hover:text-brand-primary hover:shadow-glow-sm transition-glow',
      ghost: 'text-text-secondary hover:text-brand-primary hover:bg-background-secondary transition-colors',
      danger: 'bg-status-error text-text-primary hover:bg-red-600 hover:shadow-glow-sm transition-glow',
      success: 'bg-status-success text-background-primary hover:bg-green-400 hover:shadow-glow-sm transition-glow',
    }
  },

  // Card variants
  card: {
    padding: {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
    
    shadow: {
      none: 'shadow-none',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
    },

    border: {
      none: 'border-0',
      subtle: 'border border-border-muted',
      default: 'border border-border-primary',
      strong: 'border border-border-secondary',
    }
  },

  // Input variants
  input: {
    size: {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-base',
      lg: 'px-5 py-4 text-lg',
    },

    state: {
      default: 'border-border-primary focus:border-border-focus focus:ring-2 focus:ring-brand-primary/20',
      error: 'border-status-error focus:border-status-error focus:ring-2 focus:ring-status-error/20',
      success: 'border-status-success focus:border-status-success focus:ring-2 focus:ring-status-success/20',
    }
  }
} as const;

// ============================================================================
// COMPLETE THEME EXPORT
// ============================================================================

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  breakpoints,
  animation,
  components,
} as const;

// Type exports for TypeScript support
export type Theme = typeof theme;
export type ThemeColors = typeof colors;
export type ThemeTypography = typeof typography;
export type ThemeSpacing = typeof spacing;

// Default export for convenience
export default theme;
