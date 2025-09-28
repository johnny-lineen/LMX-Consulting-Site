import brand from '@/lib/brand'

/**
 * Simple footer with brand tagline and quick links placeholder.
 */
export default function Footer() {
  return (
    <footer className="border-t mt-16">
      <div className="container-px max-w-7xl mx-auto py-10 grid gap-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-xl bg-gradient-to-br from-primary to-secondary" />
            <span className="font-semibold">{brand.name}</span>
          </div>
          <p className="text-sm text-muted">{brand.tagline}</p>
        </div>
        <div>
          <p className="font-medium mb-2">Quick Links</p>
          <ul className="space-y-2 text-sm">
            <li><a href="/consultation" className="hover:underline">Consultation</a></li>
            <li><a href="/resources" className="hover:underline">Resources</a></li>
            <li><a href="/bot" className="hover:underline">Free Consultation Bot</a></li>
          </ul>
        </div>
        <div>
          <p className="font-medium mb-2">Newsletter</p>
          <form className="flex gap-2">
            <input className="flex-1 rounded-xl border px-3 py-2" placeholder="you@company.com" />
            <button className="rounded-xl bg-secondary text-white px-4 py-2">Subscribe</button>
          </form>
          <p className="text-xs text-muted mt-2">Get weekly AI productivity tips.</p>
        </div>
      </div>
      <div className="border-t text-xs text-muted py-4 text-center">© {new Date().getFullYear()} {brand.name}. All rights reserved.</div>
    </footer>
  )
}
