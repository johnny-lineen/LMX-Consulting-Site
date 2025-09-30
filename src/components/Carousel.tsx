import { useEffect, useState } from 'react'

type Slide = { title: string, subtitle: string }

/**
 * Lightweight, dependency-free carousel.
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
    <div className="relative overflow-hidden rounded-2xl border shadow-soft">
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 p-6 md:p-10 transition-opacity duration-500 ${i === index ? 'opacity-100' : 'opacity-0'}`}
          aria-hidden={i !== index}
        >
          <h3 className="text-xl md:text-2xl font-semibold">{s.title}</h3>
          <p className="text-sm md:text-base text-muted mt-2">{s.subtitle}</p>
        </div>
      ))}
      <div className="absolute bottom-3 right-4 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`w-2.5 h-2.5 rounded-full ${i === index ? 'bg-primary' : 'bg-muted/40'}`}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i+1}`}
          />
        ))}
      </div>
    </div>
  )
}
