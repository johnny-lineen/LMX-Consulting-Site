import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { createButtonClass } from '@/lib/themeUtils'

type Props = {
  href: string
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

/**
 * Reusable CTA button component with consistent theming.
 * Uses centralized theme system for colors, spacing, and typography.
 */
export default function CTAButton({ 
  href, 
  children, 
  variant = 'primary', 
  size = 'lg',
  className 
}: Props) {
  return (
    <Link 
      href={href} 
      className={createButtonClass(variant, size, `gap-2 ${className || ''}`)}
    >
      <span>{children}</span>
      <ArrowRight size={size === 'sm' ? 16 : size === 'lg' || size === 'xl' ? 20 : 18} />
    </Link>
  )
}
