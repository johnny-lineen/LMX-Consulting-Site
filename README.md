# Consulting Site Starter (Next.js + Tailwind)

Launch-ready scaffold for a consulting website with a **hero carousel**, **free consultation bot (intake form MVP)**,
**resources library**, and a **booking page**. Centralized branding in `src/lib/brand.js` makes the site easy to restyle.

## Quick Start

```bash
# 1) Install
npm install

# 2) Run dev server
npm run dev

# 3) Open
http://localhost:3000
```

## Structure

```
src/
  pages/
    _app.tsx            # global styles + providers
    _document.tsx       # meta + html wrapper
    index.tsx           # Home (funnel optimized)
    consultation.tsx    # Booking page (embed Calendly)
    resources.tsx       # Premium resources (framing; free with consult)
    bot.tsx             # Free consultation bot (intake MVP)
  components/
    Layout.tsx          # Navbar + Footer + <Head>
    Navbar.tsx
    Footer.tsx
    Hero.tsx            # Hero + carousel + dual CTA
    Carousel.tsx        # Dependency-free carousel
    CTAButton.tsx       # Reusable CTA
  lib/
    brand.js            # <- Change brand name, tagline, colors, nav here once
public/
  logo.svg              # Placeholder logo
styles/
  globals.css
tailwind.config.js      # Reads colors from brand.js
```

## Notes & Next Steps

- **Branding**: Adjust `src/lib/brand.js` (name, tagline, colors, nav). Tailwind pulls colors from here.
- **Consultation**: Replace booking placeholder with Calendly or Stripe + booking flow.
- **Bot**: Wire `/bot` form to an API route that (a) generates a PDF and (b) emails it with Resend/SendGrid.
- **Resources**: Swap placeholders for real Notion templates/PDFs. Keep prices high for framing.
- **SEO**: Add custom meta tags, OpenGraph images, and sitemap when ready.
- **Deployment**: Deploy to Vercel. Set up a custom domain.

## Debugging Tips

- If Tailwind classes don't apply, ensure files are under `src/` and `content` globs in `tailwind.config.js` match.
- If imports fail, check `tsconfig.json` path alias: `@/* -> src/*`.
- Keep components small and commented. Use the brand config to avoid "magic numbers" scattered across files.
