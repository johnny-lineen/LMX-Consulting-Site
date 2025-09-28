import Link from 'next/link'
import brand from '@/lib/brand'
import { Menu } from 'lucide-react'
import { useState } from 'react'

/**
 * Responsive Navbar using brand.nav for links.
 * Keeps the brand cohesive and easy to extend.
 */
export default function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b">
      <div className="container-px max-w-7xl mx-auto flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-soft" />
          <span className="font-semibold">{brand.name}</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {brand.nav.map(item => (
            <Link key={item.href} href={item.href} className="text-sm hover:text-primary transition-colors">
              {item.label}
            </Link>
          ))}
          <Link href="/consultation" className="text-sm font-medium px-4 py-2 rounded-xl bg-primary text-white shadow-soft hover:opacity-90 transition">
            Book Consultation
          </Link>
        </nav>
        <button className="md:hidden p-2" aria-label="Open Menu" onClick={() => setOpen(o=>!o)}>
          <Menu />
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t">
          <div className="container-px max-w-7xl mx-auto py-2 flex flex-col gap-2">
            {brand.nav.map(item => (
              <Link key={item.href} href={item.href} className="py-2" onClick={()=>setOpen(false)}>
                {item.label}
              </Link>
            ))}
            <Link href="/consultation" className="py-2 font-medium text-primary" onClick={()=>setOpen(false)}>
              Book Consultation
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
