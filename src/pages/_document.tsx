import { Html, Head, Main, NextScript } from 'next/document'

/**
 * Custom Document for meta + font preloads (optional).
 * You can add analytics scripts here if needed.
 */
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="theme-color" content="#041E42" />
        <meta name="description" content="The Go-To Hub for AI in Microsoft 365. Access resources, templates, and connect with professionals building the future of work." />
        
        {/* Google Fonts - Professional typography pairing */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Merriweather:wght@300;400;700;900&display=swap" 
          rel="stylesheet" 
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
