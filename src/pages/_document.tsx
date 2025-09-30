import { Html, Head, Main, NextScript } from 'next/document'

/**
 * Custom Document for meta + font preloads (optional).
 * You can add analytics scripts here if needed.
 */
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="theme-color" content="#4F46E5" />
        <meta name="description" content="AI consulting for Microsoft 365 and SMB productivity." />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
