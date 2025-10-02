import { useState, FormEvent } from 'react';
import Layout from '@/components/Layout';
import { Check, AlertCircle, Star } from 'lucide-react';

interface FormData {
  clientName: string;
  email: string;
  testimonial: string;
  rating: number | null;
}

export default function TestimonialSubmitPage() {
  const [formData, setFormData] = useState<FormData>({
    clientName: '',
    email: '',
    testimonial: '',
    rating: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.clientName.trim() || !formData.email.trim() || !formData.testimonial.trim()) {
      setMessage({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/testimonials/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientName: formData.clientName.trim(),
          email: formData.email.trim(),
          testimonial: formData.testimonial.trim(),
          rating: formData.rating || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: '✅ Thanks! Your testimonial has been submitted and is pending review.' 
        });
        
        // Reset form
        setFormData({
          clientName: '',
          email: '',
          testimonial: '',
          rating: null,
        });
      } else {
        setMessage({ 
          type: 'error', 
          text: data.error || 'Failed to submit testimonial. Please try again.' 
        });
      }
    } catch (error: unknown) {
      console.error('[ERROR]:', error instanceof Error ? error.message : String(error));
      if (error instanceof Error) console.error(error.stack);
      setMessage({ 
        type: 'error', 
        text: 'Network error. Please try again.' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout title="Submit Testimonial" description="Share your experience with our services">
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Share Your Experience</h1>
            <p className="mt-2 text-gray-600">
              We'd love to hear about your experience with our services
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Message Banner */}
            {message && (
              <div
                className={`p-4 rounded-lg mb-6 flex items-start gap-3 ${
                  message.type === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {message.type === 'success' ? (
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1 text-sm">
                  {message.text}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Client Name */}
              <div>
                <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="clientName"
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email address"
                  required
                />
              </div>

              {/* Testimonial */}
              <div>
                <label htmlFor="testimonial" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Testimonial <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="testimonial"
                  value={formData.testimonial}
                  onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell us about your experience with our services..."
                  required
                />
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Rating (Optional)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <label key={star} className="cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        value={star}
                        checked={formData.rating === star}
                        onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                        className="sr-only"
                      />
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          formData.rating && star <= formData.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300 hover:text-yellow-400'
                        }`}
                      />
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Click a star to rate your experience (1-5 stars)
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-3 px-6 rounded-md font-semibold transition flex items-center justify-center gap-2 ${
                  submitting
                    ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                    : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                }`}
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Testimonial'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Your testimonial will be reviewed before being published on our website.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
