import Link from 'next/link'
import brand from '@/lib/brand'
import { Menu, User, LogOut, Settings } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import AuthModal from './AuthModal'

/**
 * Responsive Navbar using brand.nav for links.
 * Keeps the brand cohesive and easy to extend.
 */
export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    setShowUserMenu(false)
  }

  return (
    <>
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
            
            {/* Auth Section */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                >
                  <User className="w-4 h-4" />
                  {user.name}
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-background rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-2 text-sm text-muted border-b">
                      {user.email}
                    </div>
                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        // Navigate to account page if needed
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Account
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="text-sm font-medium px-4 py-2 rounded-xl border border-primary text-primary hover:bg-primary hover:text-white transition-colors"
              >
                Login
              </button>
            )}
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
              
              {/* Mobile Auth Section */}
              {user ? (
                <div className="py-2 border-t">
                  <div className="px-2 py-1 text-sm text-muted">
                    {user.name} ({user.email})
                  </div>
                  <button
                    onClick={() => {
                      handleLogout()
                      setOpen(false)
                    }}
                    className="py-2 text-sm text-red-600 hover:text-red-800"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setShowAuthModal(true)
                    setOpen(false)
                  }}
                  className="py-2 text-sm font-medium text-primary"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => setShowAuthModal(false)}
        />
      )}
    </>
  )
}
