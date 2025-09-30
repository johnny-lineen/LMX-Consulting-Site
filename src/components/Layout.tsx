import Head from 'next/head'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import brand from '@/lib/brand'

type Props = {
  title?: string
  description?: string
  children: React.ReactNode
}

/**
 * Global layout with Navbar/Footer.
 * Usage: Wrap every page with <Layout>...</Layout> to keep consistent structure.
 */
export default function Layout({ title, description, children }: Props) {
  const pageTitle = title ? `${title} • ${brand.name}` : `${brand.name} • ${brand.tagline}`
  const pageDesc = description || "Practical AI, Copilot, and automation for teams and faculty."
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
      </Head>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </>
  )
}
