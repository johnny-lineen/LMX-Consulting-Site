import Layout from '@/components/Layout'
import { useState } from 'react'

/**
 * Bot page (MVP)
 * - This is a simulated intake bot. For the fastest launch, keep it simple:
 *   1) Ask a few key questions
 *   2) On submit, show a success message
 *   3) Later, wire this form to an API route that generates a PDF and emails it
 */
export default function BotPage() {
  const [submitted, setSubmitted] = useState(false)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // TODO: POST to /api/intake and handle PDF generation + email via a provider (Resend/SendGrid)
    setSubmitted(true)
  }

  return (
    <Layout title="Free Consultation Bot" description="Answer a few questions and receive a mini-report.">
      <section className="container-px max-w-3xl mx-auto py-12 md:py-16">
        <h1 className="text-3xl font-bold">Free Consultation Bot</h1>
        <p className="text-muted mt-2">Answer a few questions. We’ll generate a mini-report and nudge you to book a 1:1 session.</p>

        {!submitted ? (
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium">Your role</label>
              <input required className="w-full mt-1 rounded-xl border px-3 py-2" placeholder="Professor, SMB owner, manager, etc." />
            </div>
            <div>
              <label className="text-sm font-medium">Top pain point</label>
              <input required className="w-full mt-1 rounded-xl border px-3 py-2" placeholder="What do you most want to improve?" />
            </div>
            <div>
              <label className="text-sm font-medium">Primary toolset</label>
              <input required className="w-full mt-1 rounded-xl border px-3 py-2" placeholder="Microsoft 365, Google Workspace, Notion, etc." />
            </div>
            <div>
              <label className="text-sm font-medium">Email to receive your mini-report</label>
              <input required type="email" className="w-full mt-1 rounded-xl border px-3 py-2" placeholder="you@company.com" />
            </div>
            <button className="rounded-xl bg-primary text-white px-5 py-3 shadow-soft hover:opacity-90 transition">Generate my mini-report</button>
          </form>
        ) : (
          <div className="mt-6 p-6 rounded-2xl border bg-white shadow-soft">
            <h2 className="text-xl font-semibold">Thanks! 🎉</h2>
            <p className="text-sm text-muted mt-2">
              We’re generating your mini-report. You’ll also get a link to book a 1:1 consultation if you want a deeper, tailored plan.
            </p>
          </div>
        )}
      </section>
    </Layout>
  )
}
