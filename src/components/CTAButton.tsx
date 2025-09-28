import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

type Props = {
  href: string
  children: React.ReactNode
}

/**
 * Reusable primary CTA button to keep consistency across pages.
 */
export default function CTAButton({ href, children }: Props) {
  return (
    <Link href={href} className="inline-flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl shadow-soft hover:opacity-90 transition">
      <span>{children}</span>
      <ArrowRight size={18} />
    </Link>
  )
}
