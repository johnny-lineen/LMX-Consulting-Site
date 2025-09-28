import { useEffect, useRef } from 'react'

/**
 * ScrollingText
 * - Infinite horizontal marquee of benefits
 * - Dots (â€¢) separate each item
 */
export default function ScrollingText({ items }: { items: string[] }) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (ref.current) {
            const el = ref.current
            let start = 0

            // âœ… FIX: arrow function instead of function declaration
            const step = () => {
                start -= 1
                if (Math.abs(start) >= el.scrollWidth / 2) {
                    start = 0
                }
                el.style.transform = `translateX(${start}px)`
                requestAnimationFrame(step)
            }

            step()
        }
    }, [])

    return (
        <div className="overflow-hidden relative w-full border-t border-b py-4 bg-background">
            <div
                ref={ref}
                className="flex whitespace-nowrap gap-8 text-lg font-medium text-primary"
                style={{ willChange: 'transform' }}
            >
                {[...items, ...items].map((item, i) => (
                    <span key={i} className="flex items-center gap-2">
                        {item}
                        <span className="text-muted">â€¢</span>
                    </span>
                ))}
            </div>
        </div>
    )
}

