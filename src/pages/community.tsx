import Layout from '@/components/Layout'
import CTAButton from '@/components/CTAButton'
import { Users, MessageCircle, Lightbulb, TrendingUp } from 'lucide-react'

/**
 * Community page - replaces the old consultation page
 * 
 * Design Decision: This page positions the site as a comprehensive AI success hub
 * rather than just Microsoft 365 focused. Emphasizes real-world insights from consultations,
 * faculty interviews, and AI tool experiments to help users succeed in the broader AI world.
 */
export default function CommunityPage() {
  return (
    <Layout 
      title="Join the LMX Community" 
      description="Succeed in the new AI world with insights from real-world consultations, faculty interviews, and AI tool experiments."
    >
      {/* Hero Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-text-primary mb-4">
              Join the LMX Community: Succeed in the New AI World
            </h1>
            <p className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              Our insights and resources are derived from real-world consultations, interviews with professors and faculty, 
              and experiments with the latest AI tools — including but not limited to Microsoft 365.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <CTAButton href="#" size="lg">
                Join Newsletter
              </CTAButton>
              <CTAButton href="/resources" variant="secondary" size="lg">
                Explore Resources
              </CTAButton>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 md:py-16 bg-bg-secondary">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-text-primary mb-6">
              How We Build Our Content
            </h2>
            <p className="text-lg text-text-secondary leading-relaxed">
              Every workflow, template, and guide in our library comes from direct consultations with professionals, 
              faculty insights, and hands-on testing of AI tools. We focus on what actually works — so you can 
              thrive in the new AI-powered workplace.
            </p>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-text-primary mb-6">
              Stay Ahead with AI
            </h2>
            <p className="text-lg text-text-secondary mb-8">
              Subscribe for resources, templates, and insights that help you succeed with Microsoft 365 and beyond.
            </p>
            
            {/* Newsletter Signup Form */}
            <div className="bg-bg-secondary rounded-2xl border border-border-primary p-8">
              <form className="flex gap-4 max-w-md mx-auto">
                <input 
                  type="email"
                  placeholder="you@company.com"
                  className="flex-1 px-4 py-3 rounded-xl border border-border-primary focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 bg-bg-primary text-text-primary placeholder-text-muted"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-brand-primary text-brand-secondary rounded-xl hover:bg-interactive-hover transition-colors duration-200 font-medium"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-xs text-text-muted mt-4">
                Get weekly AI productivity tips and exclusive resources.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Resources CTA Section */}
      <section className="py-12 md:py-16 bg-bg-secondary">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-text-primary mb-4">
              Explore Practical Tools
            </h2>
            <p className="text-lg text-text-secondary mb-8 max-w-3xl mx-auto">
              Visit our Resource Library to access playbooks, AI prompts, Notion templates, and agent workflows — 
              everything you need to succeed in the new AI world.
            </p>
            <CTAButton href="/resources" size="lg">
              Explore Resources
            </CTAButton>
          </div>
        </div>
      </section>
    </Layout>
  )
}
