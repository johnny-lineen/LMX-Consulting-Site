import Link from 'next/link'
import { brand } from '@/lib/theme'
import { Menu, User, LogOut, Settings, Shield } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import AuthModal from './AuthModal'
import { createButtonClass, createContainerClass, cn } from '@/lib/themeUtils'

/**
 * Responsive Navbar using brand.nav for links.
 * Keeps the brand cohesive and easy to extend.
 * 
 * Design Decision: Uses Merriweather serif for brand name to reinforce academic credibility,
 * while maintaining clean Inter sans-serif for navigation links. Navy primary color
 * creates professional authority consistent with Penn State aesthetic.
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
      <header className="sticky top-0 z-40 bg-bg-primary/95 backdrop-blur border-b border-border-primary shadow-soft">
        <div className={createContainerClass('xl', 'flex h-16 items-center justify-between')}>
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity group">
            <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-brand-primary to-interactive-hover shadow-glow-sm group-hover:shadow-glow-md transition-all duration-200" />
            <span className="font-display font-semibold text-text-primary group-hover:text-brand-primary transition-colors duration-200">{brand.name}</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            {brand.nav.map(item => (
                <Link 
                  key={item.href} 
                  href={item.href} 
                  className="text-sm font-medium text-text-primary hover:text-brand-primary transition-colors duration-200"
                >
                  {item.label}
                </Link>
            ))}
            <Link 
              href="/community" 
              className={createButtonClass('primary', 'sm')}
            >
              Join Community
            </Link>
            
            {/* Auth Section */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 text-sm text-text-primary hover:text-brand-primary transition-colors"
                >
                  <User className="w-4 h-4" />
                  {user.name}
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-bg-secondary rounded-lg shadow-glow-md border border-border-primary py-1 z-50 animate-fade-in">
                    <div className="px-4 py-2 text-sm text-text-secondary border-b border-border-muted">
                      {user.email}
                    </div>
                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        // Navigate to account page if needed
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-bg-tertiary hover:text-brand-primary flex items-center gap-2 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Account
                    </button>
                    {user.isAdmin && (
                      <Link
                        href="/admin/resources"
                        onClick={() => setShowUserMenu(false)}
                        className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-bg-tertiary hover:text-brand-primary flex items-center gap-2 block transition-colors"
                      >
                        <Shield className="w-4 h-4" />
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-bg-tertiary flex items-center gap-2 text-status-error hover:text-red-400 transition-colors"
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
                className={createButtonClass('outline', 'sm')}
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
          <div className="md:hidden border-t border-border-primary">
            <div className={createContainerClass('xl', 'py-2 flex flex-col gap-2')}>
              {brand.nav.map(item => (
                <Link 
                  key={item.href} 
                  href={item.href} 
                  className="py-2 text-text-primary hover:text-brand-primary transition-colors" 
                  onClick={()=>setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link 
                href="/community" 
                className="py-2 font-medium text-brand-primary hover:text-interactive-hover transition-colors" 
                onClick={()=>setOpen(false)}
              >
                Join Community
              </Link>
              
              {/* Mobile Auth Section */}
              {user ? (
                <div className="py-2 border-t border-border-muted">
                  <div className="px-2 py-1 text-sm text-text-secondary">
                    {user.name} ({user.email})
                  </div>
                  <button
                    onClick={() => {
                      handleLogout()
                      setOpen(false)
                    }}
                    className="py-2 text-sm text-status-error hover:text-red-800 transition-colors"
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
                  className="py-2 text-sm font-medium text-brand-primary hover:text-interactive-hover transition-colors"
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
