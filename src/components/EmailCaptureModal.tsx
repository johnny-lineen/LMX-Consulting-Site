import { useState } from 'react';
import { X, Mail, Lock, ExternalLink, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface EmailCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (resourceUrl: string) => void;
  resourceTitle: string;
  resourceType: string;
  resourceId?: string;
}

export default function EmailCaptureModal({
  isOpen,
  onClose,
  onSuccess,
  resourceTitle,
  resourceType,
  resourceId
}: EmailCaptureModalProps) {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleDirectAccess = async () => {
    setIsSubmitting(true);
    
    try {
      // For logged-in users, we still want to track the access
      if (resourceId) {
        const response = await fetch('/api/resources/email-capture', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            resourceId: resourceId,
            email: user?.email || '',
          }),
        });

        if (!response.ok) {
          console.error('Failed to track resource access');
        }
      }
      
      // Direct access for logged-in users
      onSuccess(window.location.href); // This will be overridden by the parent
      onClose();
    } catch (error: unknown) {
      console.error('[ERROR]:', error instanceof Error ? error.message : String(error));
      if (error instanceof Error) console.error(error.stack);
      setError('Failed to access resource. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // This would be called with the actual resourceId
      // For now, we'll simulate the API call
      const response = await fetch('/api/resources/email-capture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resourceId: resourceId || '',
          email: email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success - redirect to resource
        onSuccess(data.resourceUrl);
        onClose();
      } else {
        setError(data.error || 'Failed to process email. Please try again.');
      }
    } catch (error: unknown) {
      console.error('[ERROR]:', error instanceof Error ? error.message : String(error));
      if (error instanceof Error) console.error(error.stack);
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setError('');
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Header */}
        <div className="p-6 pb-4 border-b">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Lock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Get Access</h2>
              <p className="text-sm text-gray-600">This resource requires email verification</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Resource Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-1">{resourceTitle}</h3>
            <p className="text-sm text-gray-600 capitalize">{resourceType}</p>
          </div>

          {/* Conditional Content Based on Authentication */}
          {user ? (
            /* Logged-in User UI */
            <div className="space-y-6">
              {/* User Status */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-900">Logged in as</p>
                    <p className="text-sm text-green-700">{user.email}</p>
                  </div>
                </div>
              </div>

              {/* Direct Access Button */}
              <button
                onClick={handleDirectAccess}
                disabled={isSubmitting}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                  isSubmitting
                    ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-5 h-5" />
                    Access Resource
                  </>
                )}
              </button>

              {error && (
                <p className="text-sm text-red-600 text-center">{error}</p>
              )}
            </div>
          ) : (
            /* Logged-out User UI - Original Email Form */
            <div className="space-y-4">
              {/* Email Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="your@email.com"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  {error && (
                    <p className="mt-2 text-sm text-red-600">{error}</p>
                  )}
                </div>

                {/* Benefits */}
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">What happens next?</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Get instant access to this resource</li>
                    <li>• Receive updates on new resources</li>
                    <li>• Join our community of professionals</li>
                  </ul>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                    isSubmitting
                      ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-5 h-5" />
                      Get Instant Access
                    </>
                  )}
                </button>
              </form>

              {/* Privacy Note */}
              <p className="text-xs text-gray-500 mt-4 text-center">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
