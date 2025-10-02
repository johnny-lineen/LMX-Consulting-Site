/**
 * Theme Utility Functions
 * 
 * Helper functions for working with the theme system in components.
 * These utilities make it easier to apply consistent styling patterns.
 */

import { theme } from './theme';

// ============================================================================
// CLASS NAME BUILDERS
// ============================================================================

/**
 * Button class builder - creates consistent button styles
 */
export const buttonClasses = {
  // Base button classes
  base: 'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2',
  
  // Size variants
  size: {
    xs: 'px-2.5 py-1.5 text-xs rounded-md',
    sm: 'px-3 py-2 text-sm rounded-lg',
    md: 'px-4 py-2.5 text-sm rounded-lg',
    lg: 'px-5 py-3 text-base rounded-xl',
    xl: 'px-6 py-3.5 text-lg rounded-xl',
  },

  // Style variants - dark theme with glow effects
  variant: {
    primary: 'bg-brand-primary text-bg-primary hover:bg-interactive-hover hover:shadow-glow-md focus:ring-brand-primary focus:ring-2 transition-all duration-200 font-medium',
    secondary: 'border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-bg-primary hover:shadow-glow-sm focus:ring-brand-primary focus:ring-2 transition-all duration-200',
    outline: 'border border-border-primary text-text-primary hover:border-brand-primary hover:text-brand-primary hover:shadow-glow-sm focus:ring-brand-primary focus:ring-2 transition-all duration-200',
    ghost: 'text-text-secondary hover:text-brand-primary hover:bg-bg-secondary transition-colors duration-200',
    danger: 'bg-status-error text-text-primary hover:bg-red-600 hover:shadow-glow-sm focus:ring-status-error focus:ring-2 transition-all duration-200',
    success: 'bg-status-success text-bg-primary hover:bg-green-400 hover:shadow-glow-sm focus:ring-status-success focus:ring-2 transition-all duration-200',
  }
};

/**
 * Card class builder - creates consistent card styles
 */
export const cardClasses = {
  // Base card classes - dark theme
  base: 'bg-bg-secondary border border-border-primary rounded-xl transition-all duration-300',
  
  // Padding variants
  padding: {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  },

  // Shadow variants - dark theme with subtle glow
  shadow: {
    none: 'shadow-none',
    sm: 'shadow-dark',
    md: 'shadow-dark hover:shadow-glow-sm',
    lg: 'shadow-dark hover:shadow-glow-md',
    xl: 'shadow-dark hover:shadow-glow-lg',
    soft: 'shadow-soft hover:shadow-glow-sm',
  },

  // Interactive states - with glow effects
  interactive: 'hover:border-brand-primary hover:-translate-y-1 hover:shadow-glow-sm cursor-pointer',
};

/**
 * Input class builder - creates consistent input styles
 */
export const inputClasses = {
  // Base input classes - dark theme
  base: 'w-full border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 bg-bg-tertiary',
  
  // Size variants
  size: {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg',
  },

  // State variants - dark theme with glow effects
  state: {
    default: 'border-border-primary focus:border-brand-primary focus:ring-brand-primary/20 focus:shadow-glow-sm text-text-primary placeholder-text-muted',
    error: 'border-status-error focus:border-status-error focus:ring-status-error/20 focus:shadow-glow-sm text-text-primary placeholder-text-muted',
    success: 'border-status-success focus:border-status-success focus:ring-status-success/20 focus:shadow-glow-sm text-text-primary placeholder-text-muted',
    disabled: 'border-border-muted bg-bg-primary text-text-muted placeholder-text-muted cursor-not-allowed opacity-50',
  }
};

/**
 * Text class builder - creates consistent typography styles
 */
export const textClasses = {
  // Heading styles
  heading: {
    h1: 'text-4xl md:text-5xl font-bold text-text-primary leading-tight',
    h2: 'text-2xl md:text-3xl font-semibold text-text-primary',
    h3: 'text-xl font-semibold text-text-primary',
    h4: 'text-lg font-semibold text-text-primary',
    h5: 'text-base font-semibold text-text-primary',
    h6: 'text-sm font-semibold text-text-primary',
  },

  // Body text styles
  body: {
    large: 'text-lg text-text-primary leading-relaxed',
    base: 'text-base text-text-primary leading-normal',
    small: 'text-sm text-text-secondary',
    xs: 'text-xs text-text-muted',
  },

  // Special text styles
  special: {
    muted: 'text-text-secondary',
    accent: 'text-brand-primary',
    success: 'text-status-success',
    warning: 'text-status-warning',
    error: 'text-status-error',
    info: 'text-status-info',
  }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Combines multiple class strings, filtering out falsy values
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Creates a button class string from variant and size
 */
export function createButtonClass(
  variant: keyof typeof buttonClasses.variant = 'primary',
  size: keyof typeof buttonClasses.size = 'md',
  additionalClasses?: string
): string {
  return cn(
    buttonClasses.base,
    buttonClasses.size[size],
    buttonClasses.variant[variant],
    additionalClasses
  );
}

/**
 * Creates a card class string from options
 */
export function createCardClass(
  options: {
    padding?: keyof typeof cardClasses.padding;
    shadow?: keyof typeof cardClasses.shadow;
    interactive?: boolean;
    additionalClasses?: string;
  } = {}
): string {
  const { padding = 'md', shadow = 'sm', interactive = false, additionalClasses } = options;
  
  return cn(
    cardClasses.base,
    cardClasses.padding[padding],
    cardClasses.shadow[shadow],
    interactive && cardClasses.interactive,
    additionalClasses
  );
}

/**
 * Creates an input class string from size and state
 */
export function createInputClass(
  size: keyof typeof inputClasses.size = 'md',
  state: keyof typeof inputClasses.state = 'default',
  additionalClasses?: string
): string {
  return cn(
    inputClasses.base,
    inputClasses.size[size],
    inputClasses.state[state],
    additionalClasses
  );
}

/**
 * Creates a text class string from style type
 */
export function createTextClass(
  type: 'heading' | 'body' | 'special',
  variant: string,
  additionalClasses?: string
): string {
  const classMap = textClasses[type] as Record<string, string>;
  return cn(classMap[variant], additionalClasses);
}

// ============================================================================
// GRADIENT UTILITIES
// ============================================================================

/**
 * Gradient class combinations for backgrounds
 */
export const gradientClasses = {
  primary: 'bg-gradient-to-r from-brand-primary to-brand-secondary',
  secondary: 'bg-gradient-to-r from-brand-secondary to-brand-accent',
  success: 'bg-gradient-to-r from-status-success to-emerald-600',
  info: 'bg-gradient-to-r from-status-info to-brand-accent',
  warm: 'bg-gradient-to-r from-orange-500 to-red-500',
  cool: 'bg-gradient-to-r from-blue-500 to-purple-500',
};

/**
 * Creates a gradient class string
 */
export function createGradientClass(
  variant: keyof typeof gradientClasses,
  additionalClasses?: string
): string {
  return cn(gradientClasses[variant], additionalClasses);
}

// ============================================================================
// RESPONSIVE UTILITIES
// ============================================================================

/**
 * Container classes for consistent max-widths and padding
 */
export const containerClasses = {
  base: 'mx-auto px-4 sm:px-6 lg:px-8',
  maxWidth: {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-screen-xl',
    full: 'max-w-full',
  }
};

/**
 * Creates a container class string
 */
export function createContainerClass(
  maxWidth: keyof typeof containerClasses.maxWidth = 'xl',
  additionalClasses?: string
): string {
  return cn(
    containerClasses.base,
    containerClasses.maxWidth[maxWidth],
    additionalClasses
  );
}

// ============================================================================
// ANIMATION UTILITIES
// ============================================================================

/**
 * Common animation classes
 */
export const animationClasses = {
  transition: 'transition-all duration-300 ease-in-out',
  hover: {
    scale: 'hover:scale-105',
    lift: 'hover:-translate-y-1',
    glow: 'hover:shadow-glow',
    opacity: 'hover:opacity-90',
  },
  focus: {
    ring: 'focus:ring-2 focus:ring-brand-primary focus:ring-offset-2',
    outline: 'focus:outline-none focus:ring-2 focus:ring-brand-primary',
  }
};

/**
 * Creates animation class combinations
 */
export function createAnimationClass(
  effects: (keyof typeof animationClasses.hover)[],
  includeFocus: boolean = true,
  additionalClasses?: string
): string {
  const hoverClasses = effects.map(effect => animationClasses.hover[effect]);
  
  return cn(
    animationClasses.transition,
    ...hoverClasses,
    includeFocus && animationClasses.focus.ring,
    additionalClasses
  );
}

// Export theme for direct access
export { theme };
