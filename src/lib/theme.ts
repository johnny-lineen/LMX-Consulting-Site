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
  tagline: "The Go-To Hub for AI in Microsoft 365",
  nav: [
    { label: "Home", href: "/" },
    { label: "Community", href: "/community" },
    { label: "Resources", href: "/resources" },
    { label: "Prompts", href: "/prompts" },
    { label: "Bot", href: "/bot" },
  ],
};

// ============================================================================
// BRAND COLORS
// ============================================================================

export const colors = {
  // Primary brand colors - Penn State-inspired professional theme
  brand: {
    primary: '#041E42',      // Penn State Navy - Main brand color, headers, primary CTAs
    secondary: '#FFFFFF',    // White - Secondary buttons, contrast elements
    accent: '#EDEDED',       // Light Gray - Accent elements, subtle highlights
  },

  // Text colors - professional navy and grays
  text: {
    primary: '#041E42',      // Navy blue - Main text, headings (professional tone)
    secondary: '#6B7280',    // Medium gray - Muted text, descriptions
    muted: '#9CA3AF',        // Light gray - Disabled text, placeholders
    inverse: '#FFFFFF',      // White - Text on dark backgrounds
  },

  // Background colors - clean white and light grays
  background: {
    primary: '#FFFFFF',      // White - Main page background (clean, academic)
    secondary: '#F9FAFB',    // Very light gray - Card backgrounds, panels
    tertiary: '#EDEDED',     // Light gray - Secondary panels, elevated surfaces
    elevated: '#F3F4F6',     // Slightly darker light gray - Dropdowns, tooltips
  },

  // Border colors - subtle light theme borders
  border: {
    primary: '#E5E7EB',      // Light gray - Default borders, dividers
    secondary: '#D1D5DB',    // Medium gray - Stronger borders, focus states
    muted: '#F3F4F6',        // Very light gray - Subtle separators
    focus: '#041E42',        // Navy focus - Focus rings and active borders
  },

  // Status colors - professional with light backgrounds
  status: {
    success: '#059669',      // Emerald green - Success messages, positive actions
    warning: '#D97706',      // Amber - Warnings, caution states
    error: '#DC2626',        // Red - Errors, destructive actions
    info: '#2563EB',         // Blue - Information, neutral alerts
    
    // Light versions for backgrounds
    successMuted: '#ECFDF5', // Light green background
    warningMuted: '#FFFBEB', // Light amber background
    errorMuted: '#FEF2F2',   // Light red background
    infoMuted: '#EFF6FF',    // Light blue background
  },

  // Interactive states - professional navy variations
  interactive: {
    hover: '#1E40AF',        // Darker blue - Hover states for navy elements
    active: '#1E3A8A',       // Even darker blue - Active/pressed states
    disabled: '#9CA3AF',     // Light gray - Disabled elements
    focus: '#041E42',        // Navy focus - Focus ring color
    glow: '#041E4220',       // Navy with opacity - Subtle glow effects
  },

  // Gradient combinations - professional light theme gradients
  gradients: {
    primary: 'from-blue-900 to-blue-800',        // Navy gradient for headers
    secondary: 'from-gray-100 to-gray-200',      // Light gray gradient
    success: 'from-emerald-500 to-green-600',    // Success gradient
    accent: 'from-blue-50 to-gray-50',           // Subtle accent gradient
    glow: 'from-blue-900/10 to-blue-800/10',     // Subtle navy glow gradient
  }
} as const;

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const typography = {
  // Font families - Professional serif/sans-serif pairing
  fontFamily: {
    sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
    serif: ['Merriweather', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
    mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'SFMono-Regular', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
    display: ['Merriweather', 'Georgia', 'serif'], // Serif headings for academic feel
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
  // Professional shadows for light theme
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',

  // Custom branded shadows with navy accent
  soft: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',           // Professional soft shadow
  brand: '0 10px 15px -3px rgba(4, 30, 66, 0.1), 0 4px 6px -2px rgba(4, 30, 66, 0.05)',  // Navy brand shadow
  glow: '0 0 20px rgba(4, 30, 66, 0.15)',       // Subtle navy glow effect

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

  // Glow effects for light theme with navy accent
  glow: {
    sm: '0 0 10px rgba(4, 30, 66, 0.1)',
    md: '0 0 15px rgba(4, 30, 66, 0.15)',
    lg: '0 0 25px rgba(4, 30, 66, 0.2)',
    xl: '0 0 35px rgba(4, 30, 66, 0.25)',
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

    // Style variants - light theme optimized
    variant: {
      primary: 'bg-brand-primary text-brand-secondary hover:bg-interactive-hover hover:shadow-glow-md transition-glow font-medium',
      secondary: 'border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-brand-secondary hover:shadow-glow-sm transition-glow',
      outline: 'border border-border-primary text-text-primary hover:border-brand-primary hover:text-brand-primary hover:shadow-glow-sm transition-glow',
      ghost: 'text-text-secondary hover:text-brand-primary hover:bg-background-secondary transition-colors',
      danger: 'bg-status-error text-brand-secondary hover:bg-red-600 hover:shadow-glow-sm transition-glow',
      success: 'bg-status-success text-brand-secondary hover:bg-green-400 hover:shadow-glow-sm transition-glow',
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
