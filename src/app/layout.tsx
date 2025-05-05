import type { Metadata } from 'next'
import { cn } from '@/lib/utils'

import { Inter } from 'next/font/google'

import '@/styles/globals.css'
import { Toaster } from '@/components/ui/sonner'
import TanstackQueryProvider from '@/providers/query-client-provider'

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Polygon Hackathon Starter by Dabl Club',
  description: 'Get a head start on your hack with Polygon',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
        )}
      >
        <TanstackQueryProvider>
          {children}
          <Toaster richColors />
        </TanstackQueryProvider>
      </body>
    </html>
  )
}
