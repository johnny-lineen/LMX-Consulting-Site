// Centralized brand configuration.
// Tweak your brand here once and the whole site updates.
// Colors are Tailwind-ready via tailwind.config.js

/** @type {{name: string, tagline: string, colors: any, nav: Array<{label:string, href:string}>}} */
const brand = {
  name: "LMX Consulting",
  tagline: "Harness AI to save 10+ hours/week in Microsoft 365",
  colors: {
    // Keep these accessible; aim for strong contrast with background/foreground
    primary: "#4F46E5",     // indigo-600
    secondary: "#7C3AED",   // violet-600
    accent: "#06B6D4",      // cyan-500
    muted: "#64748B",       // slate-500
    foreground: "#0F172A",  // slate-900
    background: "#FFFFFF",  // white
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "Consultation", href: "/consultation" },
    { label: "Resources", href: "/resources" },
    { label: "Bot", href: "/bot" },
  ],
}

module.exports = brand
