# 🎨 LMX Consulting Theme System

## Overview

This project now uses a **centralized theme system** that provides a single point of control for all brand colors, typography, spacing, and design tokens. This ensures visual consistency across the entire application and makes it easy to update the brand appearance.

## 📁 File Structure

```
src/lib/
├── theme.ts          # Main theme configuration (colors, typography, spacing)
├── themeUtils.ts     # Helper functions for component styling
└── brand.js          # Legacy brand config (still used for nav items)

tailwind.config.js    # Tailwind configuration using theme tokens
```

## 🚀 Quick Start

### Changing Brand Colors

To update the primary brand color across the entire site:

1. Open `src/lib/theme.ts`
2. Find the `colors.brand.primary` value
3. Change it to your desired color (e.g., `'#FF6B35'`)
4. The change will automatically apply to:
   - All primary buttons
   - Links and interactive elements
   - Focus states
   - Tailwind classes like `bg-brand-primary`

### Adding New Colors

1. Add your color to the appropriate section in `theme.ts`:
```typescript
colors: {
  brand: {
    primary: '#4F46E5',
    secondary: '#7C3AED',
    tertiary: '#YOUR_NEW_COLOR', // Add here
  }
}
```

2. Update `tailwind.config.js` to include the new color:
```javascript
colors: {
  brand: themeColors.brand, // This will include your new color
}
```

3. Use it in components:
```tsx
<div className="bg-brand-tertiary">Content</div>
```

## 🛠️ Usage Examples

### Using Theme Utilities (Recommended)

```tsx
import { createButtonClass, createCardClass, createInputClass } from '@/lib/themeUtils'

// Create consistent buttons
<button className={createButtonClass('primary', 'lg')}>
  Primary Button
</button>

<button className={createButtonClass('outline', 'sm')}>
  Outline Button
</button>

// Create consistent cards
<div className={createCardClass({ 
  shadow: 'lg', 
  padding: 'md',
  interactive: true 
})}>
  Card content
</div>

// Create consistent inputs
<input className={createInputClass('md', 'default')} />
<input className={createInputClass('md', 'error')} />
```

### Using Tailwind Classes

The theme automatically generates Tailwind classes:

```tsx
// Colors
<div className="bg-brand-primary text-text-inverse">
<p className="text-text-secondary">
<span className="text-status-success">

// Backgrounds
<section className="bg-bg-primary">
<div className="bg-bg-secondary">

// Borders
<div className="border-border-primary">
<input className="focus:border-brand-primary">
```

### Direct Theme Access

```tsx
import { theme } from '@/lib/theme'

// Use in inline styles
<div style={{ 
  color: theme.colors.brand.primary,
  fontSize: theme.typography.fontSize.lg 
}}>

// Use in component logic
const buttonColor = isActive ? theme.colors.brand.primary : theme.colors.text.secondary
```

## 🎯 Theme Structure

### Colors

```typescript
colors: {
  // Brand identity colors
  brand: {
    primary: '#4F46E5',    // Main CTA buttons, links
    secondary: '#7C3AED',  // Secondary buttons, accents
    accent: '#06B6D4',     // Highlights, special elements
  },

  // Text colors (semantic naming)
  text: {
    primary: '#0F172A',    // Main text, headings
    secondary: '#64748B',  // Muted text, descriptions
    muted: '#94A3B8',      // Placeholder text
    inverse: '#FFFFFF',    // Text on dark backgrounds
  },

  // Background colors
  background: {
    primary: '#FFFFFF',    // Main page background
    secondary: '#F8FAFC',  // Card backgrounds
    muted: '#F1F5F9',      // Input backgrounds
  },

  // Status colors
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  }
}
```

### Typography

```typescript
typography: {
  fontSize: {
    xs: '0.75rem',    // Small labels
    sm: '0.875rem',   // Secondary text
    base: '1rem',     // Default body text
    lg: '1.125rem',   // Large body text
    xl: '1.25rem',    // Small headings
    '2xl': '1.5rem',  // Section headings
    '3xl': '1.875rem', // Page headings
    // ... more sizes
  },

  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  }
}
```

### Spacing

```typescript
spacing: {
  component: {
    padding: {
      xs: '0.5rem',   // Tight padding
      sm: '0.75rem',  // Small padding
      md: '1rem',     // Default padding
      lg: '1.5rem',   // Large padding
      xl: '2rem',     // Extra large padding
    },
    // ... margins, gaps
  }
}
```

## 🔧 Component Patterns

### Button Variants

```tsx
// Size variants
<CTAButton size="sm">Small</CTAButton>
<CTAButton size="md">Medium</CTAButton>
<CTAButton size="lg">Large</CTAButton>

// Style variants
<CTAButton variant="primary">Primary</CTAButton>
<CTAButton variant="secondary">Secondary</CTAButton>
<CTAButton variant="outline">Outline</CTAButton>
<CTAButton variant="ghost">Ghost</CTAButton>
```

### Card Variants

```tsx
// Different shadows and padding
<div className={createCardClass({ shadow: 'sm', padding: 'sm' })}>
<div className={createCardClass({ shadow: 'lg', padding: 'lg', interactive: true })}>
```

### Input States

```tsx
// Different states
<input className={createInputClass('md', 'default')} />
<input className={createInputClass('md', 'error')} />
<input className={createInputClass('md', 'success')} />
```

## 🎨 Customization Examples

### Dark Mode Support (Future)

The theme is structured to easily support dark mode:

```typescript
// Add dark mode colors
colors: {
  background: {
    primary: '#FFFFFF',      // Light mode
    primaryDark: '#0F172A',  // Dark mode
  }
}
```

### Brand Refresh

To completely refresh the brand:

1. Update all colors in `theme.ts`
2. Update font families if needed
3. Adjust spacing if the new brand requires different proportions
4. Test across all components

### Component-Specific Theming

For component-specific styling that doesn't fit the global theme:

```tsx
// Create component-specific variants
const specialButtonClass = cn(
  createButtonClass('primary', 'lg'),
  'special-animation-class',
  'component-specific-styling'
)
```

## 🧪 Testing Theme Changes

1. **Build Test**: Run `npm run build` to ensure no TypeScript errors
2. **Visual Test**: Check key pages (home, resources, admin) for consistency
3. **Interactive Test**: Test buttons, forms, and interactive elements
4. **Responsive Test**: Verify the theme works across different screen sizes

## 📋 Migration Checklist

✅ **Completed:**
- [x] Created centralized theme system (`theme.ts`)
- [x] Built theme utilities (`themeUtils.ts`)
- [x] Updated Tailwind configuration
- [x] Refactored core components (CTAButton, Navbar, Footer, Hero)
- [x] Refactored card components (Carousel, CompactResourceCard, ResourceModal)
- [x] Updated text and interactive components
- [x] Verified build success
- [x] Added comprehensive documentation

## 🚨 Important Notes

1. **Legacy Support**: The old `brand.js` file is still used for navigation items. This maintains backward compatibility.

2. **Tailwind Classes**: All new theme colors are available as Tailwind classes (e.g., `bg-brand-primary`, `text-status-error`).

3. **TypeScript Support**: The theme system is fully typed for better developer experience.

4. **Performance**: The theme system doesn't impact runtime performance - all styles are compiled at build time.

## 🤝 Contributing

When adding new components or updating existing ones:

1. Use theme utilities instead of hard-coded values
2. Follow the established naming conventions
3. Add new colors/tokens to the theme file if needed
4. Test changes across different components
5. Update documentation if adding new patterns

## 📞 Support

For questions about the theme system:
- Check the inline documentation in `theme.ts`
- Review usage examples in refactored components
- Test changes in the development environment before deploying

---

**The theme system provides a solid foundation for consistent, maintainable, and scalable UI development. Happy theming! 🎨**
