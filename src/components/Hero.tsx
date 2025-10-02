import CTAButton from '@/components/CTAButton'
import Carousel from '@/components/Carousel'
import ScrollingText from '@/components/ScrollingText'
import { createContainerClass, createTextClass } from '@/lib/themeUtils'

/**
 * Hero section with centralized theming
 * - Left: clear promise + CTA buttons
 * - Right: looping video/graphic for visual pop
 * - Below: Carousel listing consulting benefits
 */
export default function Hero() {
    const benefits = [
        "Save 10+ Hours/Week",
        "Microsoft 365 Copilot",
        "Workflow Automation",
        "Smarter Content Creation",
        "Data Summaries",
        "Faculty Focused",
        "SMB Productivity",
        "Safe & Practical"
    ]

    return (
        <>
            {/* Main Hero Section */}
            <section className="py-16 md:py-24">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-10 md:grid-cols-2 items-center">
                {/* Left side: Headline + CTA */}
                <div>
                    <h1 className={createTextClass('heading', 'h1')}>
                        Harness AI to save <span className="text-brand-primary text-glow">10+ hours/week</span>
                        in Microsoft 365
                    </h1>
                    <p className={createTextClass('body', 'large', 'mt-4')}>
                        Practical consulting, real workflows, and implementation—not theory.
                        Start with our free AI Consultation Bot, then book a 1:1 session for a custom plan.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                        <CTAButton href="/bot">Try the Free Consultation Bot</CTAButton>
                        <CTAButton href="/consultation" variant="secondary">
                            Book Paid Consultation
                        </CTAButton>
                    </div>
                </div>

                {/* Right side: Graphic / Video */}
                <div className="relative w-full h-72 md:h-96 rounded-2xl overflow-hidden shadow-glow-lg border border-border-primary bg-bg-secondary">
                    {/* Placeholder for hero graphic - dark theme optimized */}
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-bg-secondary to-bg-tertiary">
                        <div className="text-center">
                            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary shadow-glow-lg animate-glow-pulse"></div>
                            <h3 className="text-xl font-semibold text-text-primary mb-2">AI-Powered Consulting</h3>
                            <p className="text-text-secondary">Transform your workflow with intelligent automation</p>
                        </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/10 to-brand-secondary/10" />
                </div>
                </div>
            </section>

            {/* 🔥 New Scrolling Text Section */}
            <ScrollingText items={benefits} />
        </>
    )
}

