import CTAButton from '@/components/CTAButton'
import Carousel from '@/components/Carousel'
import ScrollingText from '@/components/ScrollingText'
import { createContainerClass, createTextClass } from '@/lib/themeUtils'

/**
 * Hero section with centralized theming
 * - Left: clear promise + CTA buttons
 * - Right: looping video/graphic for visual pop
 * - Below: Carousel listing consulting benefits
 * 
 * Design Decision: Large Merriweather serif heading establishes academic authority and
 * professional credibility. Navy accent color highlights key benefits while maintaining
 * clean, accessible design. Subtle gradients and shadows add depth without overwhelming
 * the professional aesthetic.
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
                    <h1 className="font-display text-4xl md:text-5xl font-bold text-text-primary leading-tight">
                        Succeed in the New <span className="text-brand-primary">AI World</span>
                    </h1>
                    <p className="text-lg text-text-primary leading-relaxed mt-4">
                        We provide practical workflows, templates, and resources derived from real-world consultations, 
                        faculty interviews, and experimentation with the latest AI tools — starting with Microsoft 365 
                        and expanding to the future of work.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                        <CTAButton href="/resources">Explore Resources</CTAButton>
                        <CTAButton href="/community" variant="secondary">
                            Join the Community
                        </CTAButton>
                    </div>
                </div>

                {/* Right side: Graphic / Video */}
                <div className="relative w-full h-72 md:h-96 rounded-2xl overflow-hidden shadow-brand border border-border-primary bg-bg-secondary">
                    {/* Placeholder for hero graphic - light theme optimized */}
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-bg-secondary to-bg-tertiary">
                        <div className="text-center">
                            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-brand-primary to-interactive-hover shadow-glow-lg animate-glow-pulse"></div>
                            <h3 className="text-xl font-display font-semibold text-text-primary mb-2">AI-Powered Consulting</h3>
                            <p className="text-text-secondary">Transform your workflow with intelligent automation</p>
                        </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/5 to-interactive-hover/5" />
                </div>
                </div>
            </section>

            {/* 🔥 New Scrolling Text Section */}
            <ScrollingText items={benefits} />
        </>
    )
}

