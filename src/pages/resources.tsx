import Layout from '@/components/Layout'

/**
 * Resources page
 * - Price high to frame value; provide free to clients post-consult as a bonus.
 * - Replace placeholders with real assets (Notion templates, PDFs, checklists).
 */
export default function ResourcesPage() {
    const items = [
        {
            title: "AI for Faculty Starter Kit",
            price: 199,
            desc: "Lesson planning, feedback workflows, office hours automation.",
            href: "#"
        },
        {
            title: "SMB Productivity Blueprint",
            price: 249,
            desc: "Email triage, reporting automation, SOP drafting with AI.",
            href: "#"
        },
        {
            title: "Microsoft 365 Copilot Quick Wins",
            price: 149,
            desc: "Prompts, tips, and guardrails for Teams, Outlook, Word.",
            href: "#"
        },
    ]

    return (
        <Layout
            title="Resources"
            description="Premium toolkits and templates—free with consultation."
        >
            <section className="container-px max-w-7xl mx-auto py-12 md:py-16">
                <h1 className="text-3xl font-bold">Resources</h1>
                <p className="text-muted mt-2">
                    These assets are priced for framing. Book a consultation to receive the relevant pack for free.
                </p>

                <div className="grid gap-6 md:grid-cols-3 mt-6">
                    {items.map((item) => (
                        <a
                            key={item.title}
                            href={item.href}
                            className="p-6 rounded-2xl border hover:shadow-soft transition block"
                        >
                            <h3 className="text-lg font-semibold">{item.title}</h3>
                            <p className="text-sm text-muted mt-1">{item.desc}</p>

                            {/* FIX: replaced Python-style .format with JS .toLocaleString() */}
                            <p className="mt-3 font-semibold">
                                ${item.price.toLocaleString()}
                            </p>

                            <p className="text-xs text-muted mt-1">
                                Included free with consultation
                            </p>
                        </a>
                    ))}
                </div>
            </section>
        </Layout>
    )
}

