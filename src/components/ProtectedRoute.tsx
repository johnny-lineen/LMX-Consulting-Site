import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      // Store the intended destination
      const currentPath = router.asPath;
      if (currentPath !== '/') {
        sessionStorage.setItem('intendedDestination', currentPath);
      }
      setShowLoginModal(true);
    }
  }, [user, loading, router.asPath]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        {fallback || (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">Authentication Required</h2>
              <p className="text-muted mb-6">Please log in to access this page.</p>
              <button
                onClick={() => setShowLoginModal(true)}
                className="bg-primary text-white px-6 py-3 rounded-lg hover:opacity-90 transition-colors"
              >
                Login
              </button>
            </div>
          </div>
        )}
        {showLoginModal && (
          <AuthModal
            onClose={() => {
              setShowLoginModal(false);
              // Redirect to home if no intended destination
              const intendedDestination = sessionStorage.getItem('intendedDestination');
              if (!intendedDestination) {
                router.push('/');
              }
            }}
            onSuccess={() => {
              setShowLoginModal(false);
              // Redirect to intended destination
              const intendedDestination = sessionStorage.getItem('intendedDestination');
              if (intendedDestination) {
                sessionStorage.removeItem('intendedDestination');
                router.push(intendedDestination);
              }
            }}
          />
        )}
      </>
    );
  }

  return <>{children}</>;
}

// Import AuthModal component (we'll create this next)
import AuthModal from './AuthModal';
