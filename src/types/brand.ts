/**
 * Brand configuration types
 */

export interface NavItem {
  label: string;
  href: string;
}

export interface BrandColors {
  primary: string;
  secondary: string;
  accent: string;
  muted: string;
  foreground: string;
  background: string;
}

export interface BrandConfig {
  name: string;
  tagline: string;
  colors: BrandColors;
  nav: NavItem[];
}
