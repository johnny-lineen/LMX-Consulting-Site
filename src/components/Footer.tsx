import { brand } from '@/lib/theme'
import { createContainerClass, createInputClass, createButtonClass } from '@/lib/themeUtils'

/**
 * Simple footer with brand tagline and quick links.
 * Uses centralized theme system for consistent styling.
 * 
 * Design Decision: Consistent with navbar typography choices - Merriweather serif for headings
 * creates visual hierarchy and academic tone. Light gray background provides subtle
 * separation from main content while maintaining professional appearance.
 */
export default function Footer() {
  return (
    <footer className="border-t border-border-primary mt-16 bg-bg-secondary shadow-soft">
      <div className={createContainerClass('xl', 'py-10 grid gap-6 md:grid-cols-3')}>
        <div>
          <div className="flex items-center gap-2 mb-2 group">
            <div className="w-6 h-6 rounded-xl bg-gradient-to-br from-brand-primary to-interactive-hover shadow-glow-sm group-hover:shadow-glow-md transition-all duration-200" />
            <span className="font-display font-semibold text-text-primary group-hover:text-brand-primary transition-colors duration-200">{brand.name}</span>
          </div>
          <p className="text-sm text-text-secondary">{brand.tagline}</p>
        </div>
        <div>
          <p className="font-display font-medium mb-2 text-text-primary">Quick Links</p>
          <ul className="space-y-2 text-sm">
            <li>
              <a 
                href="/community" 
                className="text-text-secondary hover:text-brand-primary hover:underline transition-colors hover:glow-teal"
              >
                Community
              </a>
            </li>
            <li>
              <a 
                href="/resources" 
                className="text-text-secondary hover:text-brand-primary hover:underline transition-colors hover:glow-teal"
              >
                Resources
              </a>
            </li>
            <li>
              <a 
                href="/bot" 
                className="text-text-secondary hover:text-brand-primary hover:underline transition-colors hover:glow-teal"
              >
                Free Consultation Bot
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-display font-medium mb-2 text-text-primary">Newsletter</p>
          <form className="flex gap-2">
            <input 
              className={createInputClass('sm', 'default', 'flex-1')}
              placeholder="you@company.com" 
            />
            <button 
              className={createButtonClass('secondary', 'sm')}
              type="submit"
            >
              Subscribe
            </button>
          </form>
          <p className="text-xs text-text-muted mt-2">Get weekly AI productivity tips.</p>
        </div>
      </div>
      <div className="border-t border-border-muted text-xs text-text-muted py-4 text-center">
        © {new Date().getFullYear()} {brand.name}. All rights reserved.
      </div>
    </footer>
  )
}

