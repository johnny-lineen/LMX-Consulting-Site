import Layout from '@/components/Layout'
import Hero from '@/components/Hero'
import CTAButton from '@/components/CTAButton'
import { GetStaticProps } from 'next'
import { fetchApprovedTestimonials, PublicTestimonial } from '@/lib/testimonials'
import { Star } from 'lucide-react'

/**
 * Home page optimized for funnel:
 * 1) Clear promise in hero
 * 2) How it works
 * 3) Social proof placeholder
 * 4) Two strong CTAs
 */
type HomeProps = { testimonials?: PublicTestimonial[] | null }

export default function HomePage({ testimonials = [] }: HomeProps) {
  return (
    <Layout>
      <Hero />

      {/* How it Works */}
      <section className="py-12 md:py-16">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <div className="p-6 rounded-2xl border border-border-primary shadow-soft bg-bg-secondary">
              <p className="text-sm font-medium text-brand-primary">Real-World Insights</p>
              <h3 className="text-lg font-display font-semibold mt-1 text-text-primary">Real-World Insights</h3>
              <p className="text-sm text-text-secondary mt-2">Every workflow and guide comes directly from consultations and interviews with professionals, faculty, and business leaders.</p>
            </div>
            <div className="p-6 rounded-2xl border border-border-primary shadow-soft bg-bg-secondary">
              <p className="text-sm font-medium text-brand-primary">Practical Tools</p>
              <h3 className="text-lg font-display font-semibold mt-1 text-text-primary">Practical Tools</h3>
              <p className="text-sm text-text-secondary mt-2">Access Notion templates, AI prompts, and agent workflows designed to help you thrive in the new AI-powered workplace.</p>
            </div>
            <div className="p-6 rounded-2xl border border-border-primary shadow-soft bg-bg-secondary">
              <p className="text-sm font-medium text-brand-primary">Growing Together</p>
              <h3 className="text-lg font-display font-semibold mt-1 text-text-primary">Growing Together</h3>
              <p className="text-sm text-text-secondary mt-2">Join a network of learners and professionals pushing the boundaries of productivity and innovation with AI.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Placeholder */}
      <section className="py-12 md:py-16">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-text-primary">Trusted by professionals and teams</h2>
          <p className="text-sm text-text-secondary mt-2">Join a growing community of professionals succeeding in the new AI world.</p>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
          {(() => {
            const PLACEHOLDERS = [
              { id: 'ph-0', text: '“Cut my weekly email time in half. The checklist alone was worth it.”', name: 'Placeholder', source: 'Professor' },
              { id: 'ph-1', text: '“Our reporting went from a 2-hour task to minutes with automation.”', name: 'Placeholder', source: 'SMB Owner' },
              { id: 'ph-2', text: '“The consult clarified what to deploy first. Clear, safe, and practical.”', name: 'Placeholder', source: 'Department Lead' },
            ];
            const safe = Array.isArray(testimonials) ? testimonials : [];
            const cards = [...safe, ...PLACEHOLDERS].slice(0, 3);
            return cards.map((t, index) => {
              const rawQuote = (t.text || '').toString().trim();
              const isQuoted = rawQuote.startsWith('“') || rawQuote.startsWith('"');
              const display = isQuoted ? rawQuote : `“${rawQuote}”`;
              const name = (t as any).name ? String((t as any).name).trim() : 'Placeholder';
              const source = (t as any).source ? String((t as any).source).trim() : '';
              const sub = source ? `— ${name}, ${source}` : `— ${name}`;
              const rating = typeof (t as any).rating === 'number' ? (t as any).rating : null;
              return (
                <div key={(t as any).id ?? `ph-${index}`} className="p-6 rounded-2xl border">
                  <p className="text-sm">{display}</p>
                  {rating && rating >= 1 && rating <= 5 && (
                    <div className="mt-2 mb-2 flex items-center gap-1 text-yellow-500" aria-label={`Rated ${rating} out of 5`} title={`Rated ${rating} out of 5`}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-current' : ''}`} />
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-muted mt-2">{sub}</p>
                </div>
              );
            });
          })()}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 md:py-16">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 rounded-2xl border border-border-primary shadow-soft bg-bg-secondary text-center">
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-text-primary">Ready to succeed in the AI world?</h2>
            <p className="text-sm text-text-secondary mt-2">Explore our resource library or join the community to start your AI journey.</p>
            <div className="mt-6 flex justify-center gap-3">
              <CTAButton href="/resources">Explore Resources</CTAButton>
              <CTAButton href="/community" variant="secondary">
                Join Community
              </CTAButton>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  let testimonials: PublicTestimonial[] = [];
  try {
    testimonials = await fetchApprovedTestimonials(3);
  } catch (e) {
    testimonials = [];
  }
  return {
    props: { testimonials },
    revalidate: 300
  }
}
