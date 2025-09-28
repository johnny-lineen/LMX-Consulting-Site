import CTAButton from '@/components/CTAButton'
import Carousel from '@/components/Carousel'
import ScrollingText from '@/components/ScrollingText'



/**
 * Hero section
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
            <section className="container-px max-w-7xl mx-auto py-16 md:py-24 grid gap-10 md:grid-cols-2 items-center">
                {/* Left side: Headline + CTA */}
                <div>
                    <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                        Harness AI to save <span className="text-primary">10+ hours/week</span>
                        in Microsoft 365
                    </h1>
                    <p className="text-base md:text-lg text-muted mt-4">
                        Practical consulting, real workflows, and implementation—not theory.
                        Start with our free AI Consultation Bot, then book a 1:1 session for a custom plan.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                        <CTAButton href="/bot">Try the Free Consultation Bot</CTAButton>
                        <a href="/consultation" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border hover:bg-background transition">
                            Book Paid Consultation
                        </a>
                    </div>
                </div>

                {/* Right side: Graphic / Video */}
                <div className="relative w-full h-72 md:h-96 rounded-2xl overflow-hidden shadow-soft">
                    {/* Placeholder video/graphic */}
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover opacity-80"
                    >
                        <source src="/hero-graphic.mp4" type="video/mp4" />
                        {/* fallback if video not available */}
                        Your browser does not support the video tag.
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20" />
                </div>
            </section>

            {/* 🔥 New Scrolling Text Section */}
            <ScrollingText items={benefits} />
        </>
    )
}

