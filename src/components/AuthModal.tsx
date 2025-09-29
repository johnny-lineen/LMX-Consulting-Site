import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface AuthModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const result = await login(formData.email, formData.password);
        if (result.success) {
          onSuccess?.();
        } else {
          setError(result.error || 'Login failed');
        }
      } else {
        // Validation for signup
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }
        if (!formData.name.trim()) {
          setError('Name is required');
          setLoading(false);
          return;
        }

        const result = await signup(formData.name, formData.email, formData.password);
        if (result.success) {
          onSuccess?.();
        } else {
          setError(result.error || 'Signup failed');
        }
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              {isLogin ? 'Login' : 'Sign Up'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 text-center font-medium rounded-l-lg transition-colors ${
                isLogin
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 text-center font-medium rounded-r-lg transition-colors ${
                !isLogin
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required={!isLogin}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required={!isLogin}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Confirm your password"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'Loading...' : (isLogin ? 'Login' : 'Sign Up')}
            </button>
          </form>

          {/* Switch Mode */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={switchMode}
                className="ml-1 text-primary hover:underline font-medium"
              >
                {isLogin ? 'Sign up' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
