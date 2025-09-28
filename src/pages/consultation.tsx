import Layout from '@/components/Layout'

/**
 * Consultation page
 * - Replace the Calendly embed with your scheduling tool of choice.
 * - You can gate booking behind Stripe by using a 'payment required' link or a checkout page.
 */
export default function ConsultationPage() {
  return (
    <Layout title="Consultation" description="Book a 1:1 AI consultation. Includes our $199 resource pack for free.">
      <section className="container-px max-w-4xl mx-auto py-12 md:py-16">
        <h1 className="text-3xl font-bold">Book a 1:1 Consultation</h1>
        <p className="text-muted mt-2">45–60 minutes • $75/hr starting price • Includes our $199 resource pack for free</p>
        <div className="mt-6 rounded-2xl border p-4">
          <p className="text-sm text-muted">Embed your Calendly or scheduling widget here.</p>
          <div className="mt-4 bg-muted/10 h-96 rounded-xl grid place-items-center">
            <span className="text-xs text-muted">[ Calendly Embed Placeholder ]</span>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold">What you get</h2>
          <ul className="list-disc pl-6 mt-2 text-sm text-muted space-y-1">
            <li>Tailored workflow recommendations for your role and tools</li>
            <li>Implementation checklist and 30-day plan</li>
            <li>Follow-up resources: templates, prompts, and examples</li>
          </ul>
        </div>
      </section>
    </Layout>
  )
}
