import type { AppProps } from 'next/app'
import '@/../styles/globals.css'
import { AuthProvider } from '@/context/AuthContext'

/**
 * _app.tsx wires global styles and provides a single place to add global providers later
 * (e.g., analytics, theme providers, auth). Keep this file minimal.
 */
export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
}
