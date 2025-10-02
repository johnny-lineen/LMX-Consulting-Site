import Layout from '@/components/Layout'
import { useState } from 'react'

/**
 * Free Consultation Bot form
 * - Collects user info and generates a mini-report
 * - Later: wire to API route for PDF generation + email
 */
export default function ConsultationPage() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    role: '',
    painPoint: '',
    toolset: '',
    email: ''
  })

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // TODO: POST to /api/intake and handle PDF generation + email via a provider (Resend/SendGrid)
    console.log('Form submitted:', formData)
    setSubmitted(true)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Layout title="Free Consultation Bot" description="Answer a few questions and receive a mini-report.">
      <section className="py-12 md:py-16">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Free Consultation Bot</h1>
          <p className="text-lg md:text-xl text-muted max-w-3xl mx-auto">
            Answer a few questions. We'll generate a mini-report and nudge you to book a 1:1 session.
          </p>
        </div>

        {!submitted ? (
          <div className="bg-background rounded-2xl shadow-lg border border-gray-200 p-8 md:p-12 max-w-2xl mx-auto">
            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">Your role</label>
                <input 
                  required 
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-foreground" 
                  placeholder="Professor, SMB owner, manager, etc." 
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">Top pain point</label>
                <input 
                  required 
                  value={formData.painPoint}
                  onChange={(e) => handleInputChange('painPoint', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-foreground" 
                  placeholder="What do you most want to improve?" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">Primary toolset</label>
                <input 
                  required 
                  value={formData.toolset}
                  onChange={(e) => handleInputChange('toolset', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-foreground" 
                  placeholder="Microsoft 365, Google Workspace, Notion, etc." 
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">Email to receive your mini-report</label>
                <input 
                  required 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-foreground" 
                  placeholder="you@company.com" 
                />
              </div>
              
              <button 
                type="submit"
                className="w-full bg-primary text-white font-semibold px-6 py-4 rounded-xl shadow-lg hover:opacity-90 transition-all duration-200 transform hover:-translate-y-0.5"
              >
                Generate my mini-report
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-background rounded-2xl shadow-lg border border-gray-200 p-8 md:p-12 text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Thanks! 🎉</h2>
            <p className="text-muted mb-6 text-lg">
              We're generating your mini-report. You'll also get a link to book a 1:1 consultation if you want a deeper, tailored plan.
            </p>
            <div className="bg-blue-50 rounded-lg p-6">
              <p className="text-sm text-blue-800">
                <strong>What's next:</strong> Check your email in 5-10 minutes for your personalized mini-report and consultation booking link.
              </p>
            </div>
          </div>
        )}
        </div>
      </section>
    </Layout>
  )
}
