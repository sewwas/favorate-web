import { Inter } from 'next/font/google'
import { Providers } from './providers'
import { Toaster } from 'sonner'
import Script from 'next/script'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Favorite Chicken - Meal Set Tracking',
  description: 'Track meal set usage and sales',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <head>
        <Script id="remove-grammarly" strategy="afterInteractive">
          {`
            window.addEventListener('load', () => {
              const body = document.body;
              if (body.hasAttribute('data-new-gr-c-s-check-loaded')) {
                body.removeAttribute('data-new-gr-c-s-check-loaded');
              }
              if (body.hasAttribute('data-gr-ext-installed')) {
                body.removeAttribute('data-gr-ext-installed');
              }
            });
          `}
        </Script>
      </head>
      <body suppressHydrationWarning>
        <Providers>
          {children}
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  )
}