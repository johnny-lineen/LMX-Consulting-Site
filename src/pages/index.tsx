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
      <section className="container-px max-w-7xl mx-auto py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-semibold">How it works</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="p-6 rounded-2xl border shadow-soft">
            <p className="text-sm font-medium text-primary">Step 1</p>
            <h3 className="text-lg font-semibold mt-1">Try the Free Bot</h3>
            <p className="text-sm text-muted mt-2">Answer a few questions. Get a mini-report with recommended quick wins.</p>
          </div>
          <div className="p-6 rounded-2xl border shadow-soft">
            <p className="text-sm font-medium text-primary">Step 2</p>
            <h3 className="text-lg font-semibold mt-1">Book a 1:1 Consultation</h3>
            <p className="text-sm text-muted mt-2">We tailor a plan to your workflow, tools, and security context—faculty & SMB friendly.</p>
          </div>
          <div className="p-6 rounded-2xl border shadow-soft">
            <p className="text-sm font-medium text-primary">Step 3</p>
            <h3 className="text-lg font-semibold mt-1">Implement & Iterate</h3>
            <p className="text-sm text-muted mt-2">Get templates, checklists, and a 30-day action plan. Optionally book follow-ups.</p>
          </div>
        </div>
      </section>

      {/* Social Proof Placeholder */}
      <section className="container-px max-w-7xl mx-auto py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-semibold">Trusted by educators and small teams</h2>
        <p className="text-sm text-muted mt-2">Add testimonials and case studies here as you collect them.</p>
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
      </section>

      {/* Final CTA */}
      <section className="container-px max-w-7xl mx-auto py-12 md:py-16">
        <div className="p-8 rounded-2xl border shadow-soft text-center">
          <h2 className="text-2xl md:text-3xl font-semibold">Ready to reclaim your time?</h2>
          <p className="text-sm text-muted mt-2">Start with the free bot or go straight to a 1:1 consulting session.</p>
          <div className="mt-6 flex justify-center gap-3">
            <CTAButton href="/bot">Try the Free Bot</CTAButton>
            <a href="/consultation" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border hover:bg-background transition">
              Book Paid Consultation
            </a>
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
