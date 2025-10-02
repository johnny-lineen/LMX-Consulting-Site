import { useEffect, useState } from 'react'
import { createCardClass, createTextClass } from '@/lib/themeUtils'

type Slide = { title: string, subtitle: string }

/**
 * Lightweight, dependency-free carousel with centralized theming.
 * Notes:
 * - Autoplay cycles through slides every 3.5s (configurable).
 * - Content is simple text; replace with icons/illustrations if desired.
 */
export default function Carousel({ slides, interval=3500 }: { slides: Slide[], interval?: number }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, interval)
    return () => clearInterval(id)
  }, [slides.length, interval])

  return (
    <div className={createCardClass({ shadow: 'soft', additionalClasses: 'relative overflow-hidden rounded-2xl' })}>
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 p-6 md:p-10 transition-opacity duration-500 ${i === index ? 'opacity-100' : 'opacity-0'}`}
          aria-hidden={i !== index}
        >
          <h3 className={createTextClass('heading', 'h3')}>{s.title}</h3>
          <p className={createTextClass('body', 'base', 'mt-2')}>{s.subtitle}</p>
        </div>
      ))}
      <div className="absolute bottom-3 right-4 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              i === index ? 'bg-brand-primary' : 'bg-text-muted/40 hover:bg-text-muted/60'
            }`}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i+1}`}
          />
        ))}
      </div>
    </div>
  )
}
